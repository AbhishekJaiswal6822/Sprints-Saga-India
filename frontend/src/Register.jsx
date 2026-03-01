﻿// C:\Users\abhis\OneDrive\Desktop\SOFTWARE_DEVELOPER_LEARNING\marathon_project\frontend\src\Register.jsx 
import React, { useState, useEffect, useRef } from "react";
import { RACE_PRICING } from "./constants/racePricing";
import { useNavigate } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import { api } from "./api";
import { useAuth } from "./AuthProvider";
// 1. IMPORT TOAST FOR MODERN NOTIFICATIONS
import { toast } from 'react-toastify';

// T-shirt chart image 
import tshirtChart from "./assets/tshirt-size.jpeg"

const REGISTRATION_DATA_VERSION = "v1.1"; // Change this to "v1.1" when keys change



// --- CONFIGURATION CONSTANTS ---
// --- COUPON cODE INDIVIDUAL    ---
const COUPON_CODE_FLAT = "FITISTAN100"; // Added _FLAT
const COUPON_DISCOUNT_FLAT = 100;

const PERCENT_COUPONS = ["VIJAY10", "KINNARI10", "RUNMADHU10", "DEEPAKSHI10", "DRROHAN10", "GANESH10", "DADASAHEB10", "JAANTARAJA15"];
const COUPON_DISCOUNT_PERCENT = 10;

// const PG_FEE_RATE = 0.021; // 2.1% Payment Gateway Fee
const PG_FEE_RATE = 0.025; // 2.5% Payment Gateway Fee
const GST_RATE = 0.18;    // 18% GST (Applied only to PG Fee)
// New Constant for Group Registration Limit
const MAX_GROUP_MEMBERS = 35;
// Get today's date in YYYY-MM-DD format for max DOB constraint
const today = new Date().toISOString().split('T')[0];

// Helper function for rounding to two decimal places
const roundToTwoDecimal = (num) => Math.round(num * 100) / 100;

// --- INPUT HANDLERS FOR ENFORCEMENT ---
// 1. Enforce letters, spaces, hyphens, and apostrophes (for Names)
const handleNameKeyPress = (event) => {
    // Regex for letters, spaces, hyphens, apostrophes (prevents numbers/symbols)
    const regex = /^[a-zA-Z\s'-]+$/;
    // Check if the pressed key is NOT allowed
    if (event.key.length === 1 && !regex.test(event.key)) {
        event.preventDefault();
    }
    // Allow non-character keys (e.g., Backspace, Delete, Arrow keys, etc.)
};

// 2. Enforce only digits (for Phone/Pincode)
const handleNumberKeyPress = (event) => {
    // Regex for digits (0-9)
    if (!/[0-9]/.test(event.key)) {
        event.preventDefault();
    }
};
// --- END INPUT HANDLERS ---

// --- SCROLL UTILITY FUNCTION ---
const scrollToField = (id) => {
    // We scroll the element wrapper to ensure visibility
    const element = document.getElementById(id);
    if (element) {
        // Use scrollIntoView with smooth behavior to guide the user's eye
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
};

// --- DATA STRUCTURE ---
const sizeChartData = {
    XS: { Male: 36, Female: 34 },
    S: { Male: 38, Female: 36 },
    M: { Male: 40, Female: 38 },
    L: { Male: 42, Female: 40 },
    XL: { Male: 44, Female: 42 },
    XXL: { Male: 46, Female: 44 },
    XXXL: { Male: 48, Female: 46 },
};

// Helper function to get filtered sizes based on selected gender
const getFilteredSizes = (gender) => {
    const genderKey = (gender === 'Female') ? 'Female' : 'Male';
    return Object.keys(sizeChartData).map(size => {
        const chest = sizeChartData[size][genderKey];
        return { size: size, label: `${size} (${chest} in)`, value: size };
    });
};

// --- PLATFORM FEE CONFIGURATION ---
const getPlatformFee = (raceId) => {
    switch (raceId) {
        case "5k":
            return 25; // Changed from 25 to 0 for live testing
        // return 25; // Changed from 25 to 0 for live testing
        case "10k":
            return 30;
        case "half":
            return 40;
        case "35k":
        case "full":
            return 50;
        default:
            return 0;
    }
};

const raceCategories = [
    // Change charityFee from 1600 to 0.1 for live testing
    // { id: "5k", name: "5K Fun Run", description: "Perfect for beginners", regularPrice: 799, prebookPrice: 699, charityFee: 1600 },
    { id: "5k", name: "5K Fun Run", description: "Perfect for beginners", regularPrice: 799, prebookPrice: 799, charityFee: 1600 },
    { id: "10k", name: "10K Challenge", description: "Step up your game", regularPrice: 1199, prebookPrice: 1199, charityFee: 2500 },
    { id: "half", name: "Half Marathon (21.097K)", description: "The classic distance (21.1K)", regularPrice: 1599, prebookPrice: 1599, charityFee: 2800 },
    { id: "35k", name: "35K Ultra", description: "Push your limits", regularPrice: 2399, prebookPrice: 2399, charityFee: 3500 },
    { id: "full", name: "Full Marathon (42K)", description: "The ultimate challenge", regularPrice: 2799, prebookPrice: 2799, charityFee: 4000 }
];

const charityOptions = [
    { id: "charityA", name: "Educate Maharashtra Foundation" },
    { id: "charityB", name: "Clean River Initiative" },
    { id: "charityC", name: "Healthcare for Elderly" },
];

const causeOptions = [
    "Education", "Health", "Environment", "Women Empowerment", "Animal Welfare",
];

const idOptions = ["Aadhaar Card", "PAN Card", "Passport"];

// Standard constants
const genders = ["Male", "Female", "Other"];
const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", "other"];
const statesInIndia = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];
const nationalitiesISO = [
    "Afghan", "Albanian", "Algerian", "American", "Andorran", "Angolan", "Argentine", "Armenian", "Australian", "Austrian", "Azerbaijani", "Bangladeshi", "Belarusian", "Belgian", "Bhutanese", "Bolivian", "Brazilian", "British", "Bulgarian", "Cambodian", "Cameroonian", "Canadian", "Chilean", "Chinese", "Colombian", "Costa Rican", "Croatian", "Cuban", "Cypriot", "Czech", "Danish", "Dominican", "Dutch", "Egyptian", "Emirati", "Estonian", "Ethiopian", "Finnish", "French", "Georgian", "German", "Greek", "Hungarian", "Icelandic", "Indian", "Indonesian", "Iranian", "Iraqi", "Irish", "Israeli", "Italian", "Japanese", "Jordanian", "Kenyan", "Kuwaiti", "Latvian", "Lebanese", "Lithuanian", "Luxembourgish", "Malaysian", "Mexican", "Mongolian", "Moroccan", "Nepalese", "New Zealander", "Nigerian", "Norwegian", "Omani", "Pakistani", "Peruvian", "Philippine", "Polish", "Portuguese", "Qatari", "Romanian", "Russian", "Saudi Arabian", "Singaporean", "Slovak", "Slovenian", "South African", "South Korean", "Spanish", "Sri Lankan", "Swedish", "Swiss", "Thai", "Turkish", "Ukrainian", "Uruguayan", "Vietnamese", "Zambian", "Zimbabwean"
];

// --- T-Shirt Size Popover Component (MOBILE STYLING FIXED) ---
const TShirtSizePopover = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div
            // FIX: Uses absolute positioning relative to its parent container (which needs position-relative)
            // On mobile (default), it sits below the input (top-full, left-0, w-full relative to container)
            // On md screens, it shifts to the right (md:left-full, md:ml-4, md:w-[300px])
            className="absolute top-full left-0 mt-2 z-40 p-4 bg-white border border-slate-200 rounded-lg shadow-lg max-w-[90vw] w-full md:left-full md:ml-4 md:max-w-sm md:w-[300px]"
        >
            <h4 className="font-semibold text-slate-900 mb-2 border-b pb-1 flex justify-between items-center">
                T-Shirt Size Chart
                <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-lg" aria-label="Close chart">
                    <AiOutlineClose className="h-4 w-4" />
                </button>
            </h4>
            <img
                src={tshirtChart}
                alt="T-shirt size chart"
                className="w-full h-auto rounded"
            />
            <p className="mt-2 text-xs text-slate-600">
                *Sizes are chest measurements (in inches).
            </p>
        </div>
    );
};
// --- END T-Shirt Size Chart Popover Component ---

// --- ID Upload Block Component (Reusable - Unchanged) ---
const formatIdNumber = (value) => {
    // Remove everything except A-Z and 0-9
    return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
};
const IdUploadBlock = ({ idType, idNumber, idFile, handleTypeChange, handleNumberChange, handleFileChange, sectionId }) => (
    <>
        <div className="md:col-span-2">
            <h4 className="text-md font-semibold text-slate-800 mt-4 mb-2 ">National Identity Card Upload </h4>
        </div>

        <div id={`${sectionId}-idType-wrapper`}>
            <label className="block text-sm font-medium text-slate-700 mb-1">ID Proof Type *</label>
            <select
                value={idType}
                onChange={(e) => handleTypeChange('idType', e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50"
                required
                id={`${sectionId}-idType`} // ID added for scrolling
            >
                <option value="">Select ID Type</option>
                {idOptions.map((id) => <option key={id} value={id}>{id}</option>)}
            </select>
        </div>

        <div id={`${sectionId}-idNumber-wrapper`}>
            <label className="block text-sm font-medium text-slate-700 mb-1">ID Number *</label>
            <input
                type="text"
                value={idNumber}
                onChange={(e) =>
                    handleNumberChange('idNumber', formatIdNumber(e.target.value))
                }
                placeholder="Enter your national identity number"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm"
                required
                id={`${sectionId}-idNumber`} // ID added for scrolling
            />
        </div>

        <div className="md:col-span-2" id={`${sectionId}-idFile-wrapper`}>
            <label className="block text-sm font-medium text-slate-700 mb-1">Upload Document *</label>
            <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange('idFile', e.target.files[0])}
                className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-sm shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                required
                id={`${sectionId}-idFile`} // ID added for scrolling
            />
            {idFile && <p className="text-xs text-green-600 mt-1">File Selected: {idFile.name}</p>}
        </div>
    </>
);
// --- END ID Upload Block Component ---


// --- DEFINE DEFAULTS OUTSIDE TO PREVENT INITIALIZATION ERRORS ---
const INITIAL_INDIVIDUAL_STATE = {
    firstName: "", lastName: "", parentName: "", parentPhone: "", email: "", phone: "",
    whatsapp: "", dob: "", gender: "", bloodGroup: "", nationality: "",
    address: "", city: "", state: "", pincode: "", country: "",
    needAccommodation: false,   // ADD THIS: Checkboxes must be false
    needTransportation: false,  // ADD THIS: Checkboxes must be false
    experience: "", finishTime: "", dietary: "", tshirtSize: "",
    referralCode: "", referralPoints: "", idType: "", idNumber: "", idFile: null,
};

const INITIAL_GROUP_STATE = Array.from({ length: 5 }, () => ({
    firstName: "", lastName: "", email: "", phone: "", dob: "", gender: "", tshirtSize: "",
    nationality: "", address: "", raceId: "", idType: "", idNumber: "",
    idFile: null, queryBox: "", parentName: "", parentPhone: "", city: "", state: "", pincode: "", country: ""
}));

function Register() {
    const hasNavigatedRef = useRef(false);
    const { token, user } = useAuth();
    const navigate = useNavigate();

    // STEP 1: Declare basic variables FIRST
    const [registrationType, setRegistrationType] = useState("individual");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedRace, setSelectedRace] = useState(null);
    const [openPopoverId, setOpenPopoverId] = useState(null);
    const [groupName, setGroupName] = useState("");

    // STEP 2: Declare Data States with Persistence Logic
    const [groupMembers, setGroupMembers] = useState(() => {
        try {
            const savedVersion = localStorage.getItem("data_version");
            if (savedVersion !== REGISTRATION_DATA_VERSION) return INITIAL_GROUP_STATE;
            const saved = localStorage.getItem("temp_group_members");
            return saved ? JSON.parse(saved) : INITIAL_GROUP_STATE;
        } catch (e) { return INITIAL_GROUP_STATE; }
    });

    const [individualRunner, setIndividualRunner] = useState(() => {
        try {
            const savedVersion = localStorage.getItem("data_version");
            if (savedVersion !== REGISTRATION_DATA_VERSION) {
                localStorage.setItem("data_version", REGISTRATION_DATA_VERSION);
                return INITIAL_INDIVIDUAL_STATE;
            }
            const saved = localStorage.getItem("temp_individual_runner");
            return saved ? JSON.parse(saved) : INITIAL_INDIVIDUAL_STATE;
        } catch (e) { return INITIAL_INDIVIDUAL_STATE; }
    });

    // STEP 3: Logic Hooks (Effects) AFTER variables are defined
    useEffect(() => {
        setSelectedRace(null);
    }, [registrationType]);

    useEffect(() => {
        const membersToSave = groupMembers.map(({ idFile, ...rest }) => rest);
        localStorage.setItem("temp_group_members", JSON.stringify(membersToSave));
    }, [groupMembers]);

    useEffect(() => {
        const { idFile, ...dataToSave } = individualRunner;
        localStorage.setItem("temp_individual_runner", JSON.stringify(dataToSave));
    }, [individualRunner]);

    // --- END AUTO-SAVE CODE ---

    // --- MODIFIED STATE FOR POPOVER (Unchanged) ---

    const toggleSizeChart = (id) => {
        setOpenPopoverId(prevId => prevId === id ? null : id);
    };
    // --- END MODIFIED STATE FOR POPOVER ---

    // --- Charity Participant State (Unchanged) ---
    const [charityParticipant, setCharityParticipant] = useState({
        firstName: "", lastName: "", gender: "", dob: "", phone: "", email: "", city: "", state: "",
        address: "", pincode: "", // <-- ADD THIS LINE newaddedline
        emergencyName: "", emergencyPhone: "", tshirtSize: "", nationality: "",
        idType: "",
        idNumber: "",
        idFile: null,
        isConfirmed: false,
        cause: causeOptions[0],
        dedication: "",
        isDonationAcknowledged: false,
    });
    const [charityDetails, setCharityDetails] = useState({
        selectedCharityId: charityOptions[0].id,
    });


    // --- CRITICAL FIX FOR UNCONTROLLED INPUT ERROR ---
    const handleIndividualChange = (field, value) => {
        setIndividualRunner((prev) => {
            // 1. Create a complete shallow copy of the previous state
            const updatedState = { ...prev };

            // 2. Update the specific field being changed
            updatedState[field] = value;

            // 3. Special handling for gender (to reset T-Shirt size)
            if (field === 'gender') {
                updatedState.tshirtSize = "";
            }

            // 4. Return the full object so no fields become 'undefined'
            return updatedState;
        });
    };



    // Helper functions (UPDATED: Added queryBox)
    const newMemberObject = () => ({
        firstName: "", lastName: "", email: "", phone: "", dob: "", gender: "", tshirtSize: "", nationality: "", address: "",
        raceId: "",
        idType: "", idNumber: "", idFile: null,
        queryBox: "", // <--- ADDED FIELD for query box fix
    });

    // Updated handleAddMember to respect the MAX_GROUP_MEMBERS
    const handleAddMember = () => {
        if (groupMembers.length < MAX_GROUP_MEMBERS) {
            setGroupMembers((prev) => [...prev, newMemberObject(),]);
        } else {
            // Toast message for exceeding the standard limit
            // toast.error(`Group limit reached (${MAX_GROUP_MEMBERS} members). Contact us to become a community partner.`, {
            //     toastId: 'group-limit-error-add', // Added specific ID
            // });
            toast.error(
                <span>
                    Registration 35+ MEMBERS?<br />
                    📩 Email on registration@sprintssagaindia.com to become a Community Partner
                </span>,
                {
                    toastId: 'group-limit-error-add',
                }
            );
            scrollToField('group-limit-message');
        }
    };

    // *** START FIX 1: setMemberCount Logic for input field ***

    const setMemberCount = (countValue) => {
        // 1. If the input is empty (user deleted everything), default to 1 so the field isn't broken
        if (countValue === "" || countValue === null) {
            setGroupMembers([newMemberObject()]);
            return;
        }

        // 2. Parse the value to a number. 
        // This ensures typing "12" replaces "1" instead of becoming "112"
        const parsedCount = parseInt(countValue, 10);

        // 3. n is the actual number of members we will set in state (capped at MAX_GROUP_MEMBERS and min at 1)
        const n = Math.max(1, Math.min(MAX_GROUP_MEMBERS, parsedCount || 1));

        // 4. Show toast if user tries to exceed 35
        if (parsedCount > MAX_GROUP_MEMBERS) {
            // toast.error(`Group limit is ${MAX_GROUP_MEMBERS} members.`, {
            toast.error(
                <span>
                    Registration 35+ MEMBERS?<br />
                    📩 Email on registration@sprintssagaindia.com to become a Community Partner
                </span>,
                {
                    toastId: 'group-limit-error-input',
                    style: { width: "400px" }, // Forces the box to be wider
                    autoClose: 5000,
                    pauseOnFocusLoss: false,
                }
            );
        }

        setGroupMembers((prev) => {
            const cur = prev.length;
            if (n === cur) return prev;

            if (n > cur) {
                const addCount = n - cur;
                const membersToAdd = Array.from({ length: addCount }, () => newMemberObject());
                return [...prev, ...membersToAdd];
            } else {
                return prev.slice(0, n);
            }
        });
    };
    // *** END FIX 1 ***
    // *** END FIX 1: setMemberCount Logic for input field ***

    const handleRemoveMember = (indexToRemove) => setGroupMembers((prev) => prev.length <= 1 ? prev : prev.filter((_, i) => i !== indexToRemove));

    const handleMemberChange = (index, field, value) => {
        setGroupMembers(prev => prev.map((member, i) => {
            if (i === index) {
                const updatedMember = { ...member, [field]: value };
                // Reset tshirtSize if gender changes
                if (field === 'gender') {
                    updatedMember.tshirtSize = "";
                }
                return updatedMember;
            }
            return member;
        }));
    };

    const handleCharityParticipantChange = (field, value) => {
        if (field === 'gender') {
            setCharityParticipant(prev => ({
                ...prev,
                gender: value,
                tshirtSize: "" // Reset size
            }));
        } else {
            setCharityParticipant(prev => ({ ...prev, [field]: value }));
        }
    };

    // FIX 1: Define memberCount early to avoid ReferenceError in JSX/calculations
    const memberCount = groupMembers.length;

    // --- MANDATORY ADD-ONS FEE ---
    const mandatoryAddOns = 0; // FIXED: Set to 0 to remove the base cost

    // --- CALCULATIONS ---
    // Initialize calculation variables
    let platformFee = 0;
    let rawRegistrationFee = 0;
    let discountAmount = 0;
    let pgBaseForRegFee = 0; // Registration Fee - Discount (Base for PG Fee calculation)
    let pgFee = 0;
    let gstAmount = 0;
    let totalAmountPayable = 0;
    let discountPercent = 0;

    // --- Price calculation logic start (UPDATED for initial state) ---
    const raceIsSelected = selectedRace || (registrationType === 'group' && groupMembers.length > 0 && groupMembers[0]?.raceId);


    if (raceIsSelected) {
        // Reset values to avoid stale data
        rawRegistrationFee = 0;
        discountAmount = 0;
        discountPercent = 0;
        platformFee = 0;

        // --------------------------------------------------
        // 1. BASE REGISTRATION FEE
        // --------------------------------------------------

        // INDIVIDUAL / CHARITY
        if (registrationType === "individual" || registrationType === "charity") {
            if (selectedRace) {
                rawRegistrationFee =
                    registrationType === "individual"
                        ? selectedRace.prebookPrice
                        : selectedRace.charityFee;

                // Coupon ONLY for individual
                if (registrationType === "individual" && selectedRace) {
                    const code = individualRunner.referralCode;

                    if (code === COUPON_CODE_FLAT) {
                        discountAmount = COUPON_DISCOUNT_FLAT;
                        discountPercent = (discountAmount / rawRegistrationFee) * 100;
                    }
                    else if (PERCENT_COUPONS.includes(code)) {
                        // NEW LOGIC: Check for specific 15% code, else default to 10%
                        if (code === "JAANTARAJA15") {
                            discountPercent = 15;
                        } else {
                            discountPercent = 10;
                        }

                        discountAmount = rawRegistrationFee * (discountPercent / 100);
                    }
                }
            }
        }

        // GROUP
        else if (registrationType === "group") {
            const memberPrices = groupMembers.map(member => {
                const race = raceCategories.find(r => r.id === member.raceId);
                return race ? race.prebookPrice : 0;
            });

            rawRegistrationFee = memberPrices.reduce(
                (sum, price) => sum + price,
                0
            );

            // Group discount (NO coupon here)
            if (memberCount >= 25) discountPercent = 12;
            else if (memberCount >= 10) discountPercent = 8;
            else discountPercent = 0;

            if (discountPercent > 0) {
                discountAmount = Math.round(
                    rawRegistrationFee * (discountPercent / 100)
                );
            }
        }

        // --------------------------------------------------
        // 2. PG BASE (Registration Fee - Discount)
        // --------------------------------------------------
        pgBaseForRegFee = rawRegistrationFee - discountAmount;

        // --------------------------------------------------
        // 3. PLATFORM FEE
        // --------------------------------------------------
        if (registrationType === "group") {
            platformFee = groupMembers.reduce(
                (sum, member) => sum + getPlatformFee(member.raceId),
                0
            );
        } else if (selectedRace) {
            platformFee = getPlatformFee(selectedRace.id);
        }

        // --------------------------------------------------
        // 4. PG FEE & GST
        // --------------------------------------------------
        const pgFeeRaw = pgBaseForRegFee * PG_FEE_RATE;
        pgFee = roundToTwoDecimal(pgFeeRaw);

        const gstAmountRaw = pgFee * GST_RATE;
        gstAmount = roundToTwoDecimal(gstAmountRaw);

        // --------------------------------------------------
        // 5. FINAL TOTAL
        // --------------------------------------------------
        const subtotalBeforePG = pgBaseForRegFee + platformFee;
        totalAmountPayable = roundToTwoDecimal(
            subtotalBeforePG + pgFee + gstAmount
        );

    } else {
        // No race selected → everything zero
        rawRegistrationFee = 0;
        discountAmount = 0;
        discountPercent = 0;
        platformFee = 0;
        pgFee = 0;
        gstAmount = 0;
        totalAmountPayable = 0;
    }

    // --- Price calculation logic end ---

    // FIX FOR CRASH: Ensure groupMembers is not empty before attempting to reduce/summarize
    const calculateRaceSummary = (members) => {
        if (!members || members.length === 0) return {};

        return members.reduce((acc, member) => {
            // Ensure member and raceId exist before proceeding to find the race
            if (!member || !member.raceId) return acc;

            const race = raceCategories.find(r => r.id === member.raceId);

            // CRASH FIX: Check if race is defined before accessing its name property
            if (race) {
                acc[race.name] = (acc[race.name] || 0) + 1;
            }
            return acc;
        }, {});
    };

    const raceSummaryData = registrationType === "group" ? calculateRaceSummary(groupMembers) : null;
    // CRASH FIX: Object.entries must always be called on a valid object (or null/false if checked in JSX)
    const raceSummary = raceSummaryData ? Object.entries(raceSummaryData) : null;
    // --- END CALCULATIONS ---

    // --- FIELD MAPPING FOR SCROLLING ---
    // Maps field name to its corresponding HTML ID.
    const getFieldMap = (prefix) => ({
        // Charity/Individual Common Fields
        firstName: `${prefix}-firstName-wrapper`,
        lastName: `${prefix}-lastName-wrapper`,
        phone: `${prefix}-phone-wrapper`,
        email: `${prefix}-email-wrapper`,
        dob: `${prefix}-dob-wrapper`,
        gender: `${prefix}-gender-wrapper`,
        tshirtSize: `${prefix}-tshirtSize-wrapper`,
        nationality: `${prefix}-nationality-wrapper`,
        address: `${prefix}-address-wrapper`, // <-- ADD THIS LINE newaddedline
        pincode: `${prefix}-pincode-wrapper`, // <-- ADD THIS LINE newaddedline

        // Individual Specific Fields
        parentName: `individual-parentName-wrapper`,
        parentPhone: `individual-parentPhone-wrapper`,
        experience: `individual-experience-wrapper`,
        // address: `individual-address-wrapper`,
        city: `individual-city-wrapper`,
        state: `individual-state-wrapper`,
        // pincode: `individual-pincode-wrapper`,
        country: `individual-country-wrapper`,

        // Charity Specific Fields
        cause: `charity-cause-wrapper`,
        emergencyName: `charity-emergencyName-wrapper`,
        emergencyPhone: `charity-emergencyPhone-wrapper`,

        // Checkboxes & Files (using wrapper ID)
        isDonationAcknowledged: 'charity-donation-ack-wrapper',
        idType: `${prefix}-idType-wrapper`,
        idNumber: `${prefix}-idNumber-wrapper`,
        idFile: `${prefix}-idFile-wrapper`,
    });

    // --- START VALIDATION FUNCTION (UPDATED TOAST AND SCROLLING) ---
    const validateForm = () => {
        // *** START FIX 2: Dismiss all previous toasts before starting validation ***
        toast.dismiss();
        // *** END FIX 2 ***

        // --- 0. RACE SELECTION ---
        if (!selectedRace && (registrationType === "individual" || registrationType === "charity")) {
            toast.error("Please select a Race Category.");
            scrollToField('race-category-section-header');
            return false;
        }

        // Using `totalAmountPayable` for final validity check
        if (totalAmountPayable <= 0 && raceIsSelected) { // Check only if a race is actually selected
            toast.error("Total payable amount is zero. Please select a valid registration option.");
            return false;
        }

        // --- 0.5 GROUP LIMIT CHECK ---
        if (registrationType === 'group' && memberCount > MAX_GROUP_MEMBERS) {
            // This check should ideally not fire if the input is maxed at 35, 
            // but it's a defensive check if button or manual input fails.
            toast.error("Group size exceeds the maximum limit (35). Please contact us to register as a community partner.");
            scrollToField('group-limit-message');
            return false;
        }

        // --- 1. INDIVIDUAL VALIDATION ---
        if (registrationType === "individual") {
            const runner = individualRunner;
            const fieldMap = getFieldMap('individual');
            const requiredFields = [
                'firstName', 'lastName', 'email', 'phone', 'dob', 'gender', 'tshirtSize',
                'nationality', 'address', 'city', 'state', 'pincode', 'country', 'experience',
                'idType', 'idNumber', 'idFile', 'parentName', 'parentPhone'
            ];

            for (const field of requiredFields) {
                if (!runner[field] || runner[field] === "") {
                    toast.error(`Individual: Please fill the required field: ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
                    scrollToField(fieldMap[field] || 'individual-section');
                    return false;
                }
            }
            return true;
        }

        // --- 2. GROUP VALIDATION ---
        if (registrationType === "group") {
            if (!groupName) {
                toast.error("Group Name is mandatory.");
                scrollToField('groupName-wrapper');
                return false;
            }

            for (let i = 0; i < groupMembers.length; i++) {
                const member = groupMembers[i];
                const requiredFields = ['raceId', 'firstName', 'lastName', 'email', 'phone', 'gender', 'tshirtSize'];

                for (const field of requiredFields) {
                    if (!member[field] || member[field] === "") {
                        toast.error(`Member ${i + 1}: Please fill the required field: ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
                        scrollToField('group-registration-details');
                        return false;
                    }
                }

                // Group Leader (Member 1) requires ID and Address details
                if (i === 0) {
                    if (!member.nationality || !member.address || !member.idType || !member.idNumber || !member.idFile) {
                        toast.error("Group Leader (Member 1) must provide Nationality, Address, and National Identity Card details.");
                        scrollToField('group-registration-details');
                        return false;
                    }
                }
            }
            return true;
        }

        // --- 3. CHARITY VALIDATION ---
        if (registrationType === "charity") {
            const runner = charityParticipant;
            const fieldMap = getFieldMap('charity');

            // Critical Acknowledgment Check (Must be first)
            if (!runner.isDonationAcknowledged) {
                toast.error("Please acknowledge the donation terms.");
                scrollToField(fieldMap.isDonationAcknowledged);
                return false;
            }

            const requiredFields = [
                'firstName', 'lastName', 'gender', 'dob', 'phone', 'email', 'city',
                'state', 'address', 'pincode', 'emergencyName', 'emergencyPhone', 'tshirtSize', 'cause', // <-- ADD 'address', 'pincode' HERE newaddedline
                'nationality', 'idType', 'idNumber', 'idFile'
            ];

            for (const field of requiredFields) {
                if (!runner[field] || runner[field] === "") {
                    toast.error(`Charity: Please fill the required field: ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
                    scrollToField(fieldMap[field] || 'charity-section');
                    return false;
                }
            }
            return true;
        }

        return true;
    };
    // --- END VALIDATION FUNCTION ---

    // --- CRITICAL FIX: ASYNC API SUBMISSION (UPDATED TOAST) ---
    const handleProceedToPayment = async (e) => {
        e.preventDefault();
        if (hasNavigatedRef.current) return;
        hasNavigatedRef.current = true;
        setIsSubmitting(true);

        // *** START FIX 2: Dismiss all toasts before validation and submission ***
        toast.dismiss();
        // *** END FIX 2 ***

        if (!validateForm()) {
            setIsSubmitting(false);
            hasNavigatedRef.current = false;
            return;
        }

        if (!token) {
            toast.error("Error: User session expired. Please log in again.");
            setIsSubmitting(false);
            hasNavigatedRef.current = false;
            return;
        }

        let dataToSave;
        if (registrationType === 'individual') {
            dataToSave = individualRunner;
        } else if (registrationType === 'charity') {
            dataToSave = charityParticipant;
        } else if (registrationType === 'group') {
            dataToSave = { groupName, groupMembers };
        }

        // --- 1. CONSTRUCT FormData for file upload ---
        const formData = new FormData();
        formData.append('registrationType', registrationType);
        // Use selected race ID for individual/charity, or first member's race ID for group
        const raceIdToSave = selectedRace?.id || groupMembers[0]?.raceId;
        formData.append('raceId', raceIdToSave);

        //  CRITICAL: SEND BILLING DATA TO BACKEND 
        formData.append("registrationFee", rawRegistrationFee);
        formData.append("discountAmount", discountAmount);
        formData.append("discountPercent", discountPercent);
        formData.append("platformFee", platformFee);
        formData.append("pgFee", pgFee);
        formData.append("gstAmount", gstAmount);
        formData.append("amount", totalAmountPayable);
        if (registrationType === "individual") {
            formData.append("couponCode", individualRunner.referralCode);
        }


        if (registrationType === 'individual' || registrationType === 'charity') {
            for (const key in dataToSave) {
                if (key !== 'idFile') {
                    formData.append(key, dataToSave[key]);
                }
            }
            formData.append('idProofFile', dataToSave.idFile);

            /* ... earlier formData appends ... */

        } else if (registrationType === 'group') {
            const leader = groupMembers[0];
            formData.append('groupName', groupName || "Unnamed Group");

            if (leader) {
                // Ensure top-level fields match the Model's RunnerDetails requirement
                formData.append('firstName', leader.firstName || "");
                formData.append('lastName', leader.lastName || "");
                formData.append('email', leader.email || "");
                formData.append('phone', leader.phone || "");
                formData.append('dob', leader.dob || today);
                formData.append('gender', leader.gender || "Male");
                formData.append('nationality', leader.nationality || "Indian");
                formData.append('address', leader.address || "N/A");
                formData.append('city', leader.city || "N/A");
                formData.append('state', leader.state || "Maharashtra");
                formData.append('pincode', leader.pincode || "000000");
                formData.append('country', leader.country || "India");
                formData.append('tshirtSize', leader.tshirtSize || "M");
                formData.append('idType', leader.idType || "Aadhaar Card");
                formData.append('idNumber', leader.idNumber || "0000");
                if (leader.idFile) formData.append('idProofFile', leader.idFile);
            }
            const membersToFinalize = groupMembers.map((member, index) => {
                const raceObj = raceCategories.find(r => r.id === member.raceId) || raceCategories[0];

                // Base object for all members
                const finalizedMember = {
                    firstName: member.firstName || `Member ${index + 1}`,
                    lastName: member.lastName || "N/A",
                    email: member.email || "N/A",
                    phone: member.phone || "0000000000",
                    dob: member.dob || today,
                    gender: member.gender || "Male",
                    tshirtSize: member.tshirtSize || "M",
                    raceCategory: raceObj.name,
                };

                if (index === 0) {
                    // ONLY Member 1 (Leader) gets these full details
                    return {
                        ...finalizedMember,
                        nationality: member.nationality || "Indian",
                        address: member.address || "N/A",
                        city: member.city || "N/A",
                        state: member.state || "N/A",
                        pincode: member.pincode || "N/A",
                        country: member.country || "India",
                        parentName: member.parentName || "N/A",
                        parentPhone: member.parentPhone || "N/A"
                    };
                } else {
                    // Members 2+ DO NOT get address/parent info copied from leader
                    // They save as "N/A" to match the fact that UI didn't ask for them
                    return {
                        ...finalizedMember,
                        nationality: "N/A",
                        address: "N/A",
                        city: "N/A",
                        state: "N/A",
                        pincode: "N/A",
                        country: "N/A",
                        parentName: "N/A",
                        parentPhone: "N/A"
                    };
                }
            });
            // FIXED: Send 'membersToFinalize'
            formData.append('groupMembers', JSON.stringify(membersToFinalize));
        }

        let currentRegistrationId = null;

        try {

            localStorage.removeItem("temp_individual_runner");
            localStorage.removeItem("temp_group_members");
            // --- ATTEMPT TO SAVE REGISTRATION DETAILS ---
            console.log("[FRONTEND SAVING REGISTRATION]: POST /api/register");

            const response = await api('/api/register', {
                method: 'POST',
                body: formData,
                token: token,
            });

            // SUCCESSFUL SAVE PATH
            currentRegistrationId = response.registrationId;
            console.log(`[REGISTRATION SUCCESS]: Saved ID ${currentRegistrationId}. Redirecting...`);

            // Dismiss all toasts before successful navigation
            toast.dismiss();

        }
        catch (error) {
            setIsSubmitting(false);
            hasNavigatedRef.current = false;
            console.error("Registration Save Error:", error.message, error);

            // --- 1. HANDLE EXISTING REGISTRATION (The Logged-in User Case) ---
            if (error.errorCode === "REGISTRATION_EXISTS" && error.registrationId) {
                const existingId = error.registrationId;

                // Show info toast before redirecting the LOGGED-IN user
                toast.info("You already have a pending registration. Redirecting to complete payment.");
                console.log("[EXISTING REGISTRATION/PENDING PAYMENT]: Redirecting to payment");

                // Dismiss all toasts before navigation
                toast.dismiss();

                navigate("/payment", {
                    state: {
                        amount: totalAmountPayable,
                        registrationType,
                        raceCategory: selectedRace?.name || groupMembers[0]?.raceId,
                        registrationId: existingId, // Use the ID returned by the error
                        rawRegistrationFee,
                        discountAmount,
                        platformFee,
                        addOns: mandatoryAddOns,
                        pgFee,
                        gstAmount
                    }
                });
                return; //  STOP execution here (Successful redirect)
            }

            // --- 2. HANDLE AUTH/GENERIC ERRORS ---
            // Catch 401 status or generic token errors
            if (!token || error.status === 401 || (error.message && error.message.includes("Token is not valid"))) {
                toast.error("Your session has expired or you are not logged in. Please log in or register.");
                return;
            }

            // --- 3. HANDLE ALL OTHER UNEXPECTED ERRORS (Default) ---
            toast.error(error.message || "Failed to save registration due to an unexpected server error.");
            return;
        }


        // --- FINAL STEP: REDIRECT TO PAYMENT PAGE (Passing full breakdown) ---
        if (currentRegistrationId) {
            // Dismiss all toasts before final successful navigation
            toast.dismiss();

            navigate("/payment", {
                state: {
                    // Pass the amount *including* platform fee, as PG is calculated on this base
                    amount: totalAmountPayable,
                    registrationType,
                    raceCategory: selectedRace?.name || groupMembers[0]?.raceId, // Pass category name
                    registrationId: currentRegistrationId,
                    // Pass Breakdown for PaymentPage Summary
                    rawRegistrationFee: rawRegistrationFee,
                    discountAmount: discountAmount,
                    platformFee: platformFee,
                    addOns: mandatoryAddOns, // Now sends 0
                    pgFee: pgFee,
                    gstAmount: gstAmount
                },
            });
        }

    };
    // --- END CRITICAL FIX: ASYNC API SUBMISSION ---

    // --- BUTTON TEXT AND VISIBILITY LOGIC ---
    const isRaceSelectionValid = selectedRace || (registrationType === 'group' && memberCount > 0 && groupMembers[0]?.raceId);

    let buttonText;
    let buttonDisabled = !isRaceSelectionValid; // Disable initially if no race is selected

    if (isRaceSelectionValid) {
        if (totalAmountPayable > 0) {
            buttonText = `Proceed to Payment - ₹${totalAmountPayable.toFixed(2)}`;
            buttonDisabled = false;
        } else {
            // Should only happen if fees zero it out
            buttonText = `Complete Registration (Free)`;
            buttonDisabled = false;
        }
    } else {
        // Default state when landing on the page or no race selected
        buttonText = `Proceed to Payment`;
        buttonDisabled = true; // Keep button disabled until a selection is made
    }

    // NEW: Override button state if group member count exceeds MAX_GROUP_MEMBERS
    const isOverGroupLimit = registrationType === 'group' && memberCount > MAX_GROUP_MEMBERS;
    if (isOverGroupLimit) {
        buttonDisabled = true;
        buttonText = `Contact for Partnership`;
    }

    if (isSubmitting) {
        buttonText = `Payment Processing - ₹${totalAmountPayable.toFixed(2)}`;
    } else if (isRaceSelectionValid && !isOverGroupLimit) {
        // We add !isOverGroupLimit so it doesn't overwrite the partnership message
        buttonText = `Proceed to Payment - ₹${totalAmountPayable.toFixed(2)}`;
        buttonDisabled = false;
    }


    // --- END BUTTON TEXT LOGIC ---


    const isRaceSelectionMissing = (registrationType === "individual" || registrationType === "charity") && !selectedRace;


    return (
        <main className="min-h-screen bg-slate-50">
            <section className="max-w-6xl mx-auto px-4 py-12">
                <div className="text-center mb-10 mt-10">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-teal-700 tracking-tight">
                        Register for LokRaja Marathon 2026
                    </h1>
                    <p className="mt-3 text-slate-600">Choose your registration type and complete your details</p>
                </div>

                {/* <form onSubmit={handleProceedToPayment} className="space-y-8"> */}
                <form className="space-y-8">
                    {/* Registration Type Selection (Unchanged) */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
                        <h2 className="text-xl font-semibold text-slate-900">Registration Type</h2>
                        <p className="text-sm text-slate-500 mt-1">Choose between individual, group, or charity registration</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <button type="button" onClick={() => setRegistrationType("individual")} className={`rounded-2xl border p-4 text-left transition ${registrationType === "individual" ? "border-teal-600 bg-teal-50" : "border-slate-200 hover:border-teal-400"}`}>
                                <h3 className="font-semibold text-slate-900">Individual Registration</h3>
                                <p className="text-sm text-slate-600 mt-1">Register as a single participant.</p>
                            </button>
                            <button type="button" onClick={() => setRegistrationType("group")} className={`rounded-2xl border p-4 text-left transition ${registrationType === "group" ? "border-teal-600 bg-teal-50" : "border-slate-200 hover:border-teal-400"}`}>
                                <h3 className="font-semibold text-slate-900">Group Registration</h3>
                                <p className="text-sm text-slate-600 mt-1">Register multiple participants together. Discounts available for 10, or 25+ members.</p>
                            </button>
                            <button type="button" onClick={() => setRegistrationType("charity")} className={`rounded-2xl border p-4 text-left transition ${registrationType === "charity" ? "border-teal-600 bg-teal-50" : "border-slate-200 hover:border-teal-400"}`}>
                                <h3 className="font-semibold text-slate-900">Charity Registration</h3>
                                <p className="text-sm text-slate-600 mt-1">Run for a cause and support a charity.</p>
                            </button>
                        </div>

                        {/* Info Box (Unchanged) */}
                        <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 flex items-start gap-3">
                            <div className="mt-1">
                                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                                    {registrationType === "individual" && "👤"}
                                    {registrationType === "group" && "👥"}
                                    {registrationType === "charity" && "🎗️"}
                                </span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900">
                                    {registrationType === "individual" && "Individual Registration"}
                                    {registrationType === "group" && "Group Registration"}
                                    {registrationType === "charity" && "Charity Registration"}
                                </h3>
                                <p className="text-sm text-slate-600 mt-1">
                                    {registrationType === "individual" && "Register yourself for the marathon."}
                                    {registrationType === "group" && "Register multiple participants together. Discounts available for 10, or 25+ members."}
                                    {registrationType === "charity" && "Your registration includes the race fee and a fixed, non-refundable donation component."}
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* Choose Race Category (Individual & Charity) */}
                    {(registrationType === "individual" || registrationType === "charity") && (
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
                            <div id="race-category-section-header" className="flex items-center gap-2">
                                <span className="text-teal-600 text-xl">🏆</span>
                                <h2 className="text-xl font-semibold text-slate-900">Choose Your Race Category</h2>
                            </div>
                            <p className="text-sm text-slate-500 mt-1">Select the distance that matches your goals</p>

                            {isRaceSelectionMissing && (
                                <div className="my-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-sm font-semibold border border-rose-300">
                                    Please select a race category to proceed with registration.
                                </div>
                            )}


                            <div className="mt-6 grid gap-4 md:grid-cols-3">
                                {raceCategories.map((race) => {
                                    // Safely check if selectedRace is non-null before checking its ID
                                    const isSelected = selectedRace && selectedRace.id === race.id;
                                    // PRICE LOGIC: Use charityFee for charity registration, prebookPrice for individual
                                    const priceToDisplay = registrationType === "charity" ? race.charityFee : race.prebookPrice;

                                    return (
                                        <button
                                            key={race.id}
                                            type="button"
                                            onClick={() => {
                                                if (isSelected) {
                                                    setSelectedRace(null);
                                                } else {
                                                    setSelectedRace(race);
                                                }
                                            }}
                                            className={`cursor-pointer relative w-full text-left rounded-2xl border px-5 py-4 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${isSelected ? "border-teal-500 bg-cyan-50 shadow-sm" : "border-slate-200 hover:border-teal-300 hover:bg-slate-50"}`}
                                        >
                                            <div className="flex justify-between items-start gap-3">
                                                <div>
                                                    <p className="font-semibold text-slate-900">{race.name}</p>
                                                    <p className="text-sm text-slate-500 mt-1">{race.description}</p>
                                                </div>

                                                {/* START MODIFIED PRICE BLOCK (INDIVIDUAL ONLY) */}
                                                {registrationType === "individual" ? (
                                                    <div className="flex flex-col items-end">
                                                        {/* REGULAR PRICE (CUT OFF) */}
                                                        {/* <span className="text-sm font-medium text-slate-500 line-through opacity-70">
                                                            ₹{race.regularPrice}
                                                        </span> */}
                                                        {/* PRE-BOOK PRICE (ACTUAL PRICE) */}
                                                        <span className="inline-flex items-center rounded-full px-3 py-1 text-base font-bold bg-teal-600 text-white shadow-md">
                                                            ₹{race.prebookPrice}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    /* CHARITY PRICE (Original logic, UNCHANGED) */
                                                    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-cyan-500 text-white">
                                                        ₹{priceToDisplay}
                                                    </span>
                                                )}
                                            </div>

                                            {registrationType === "charity" && (
                                                <p className="text-xs text-rose-500 mt-1">
                                                    (Fixed Charity Fee)
                                                </p>
                                            )}

                                            {isSelected && (
                                                <div className="mt-3 flex items-center gap-2 text-xs font-medium text-teal-700">
                                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-white text-[10px]">✓</span>
                                                    <span>Selected</span>
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                        </div>
                    )}
                    {/* 3. Individual Registration Full Sections */}
                    {/* individual section */}
                    {registrationType === "individual" && (
                        <>
                            {/* Personal Information */}
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-6">
                                <h2 className="text-xl font-semibold text-slate-900">Personal Information</h2>
                                <p className="text-sm text-slate-500">Please provide your complete personal details as per government ID</p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div><label className="block text-sm font-medium text-slate-700">First Name *</label><input type="text" value={individualRunner.firstName} onChange={e => handleIndividualChange('firstName', e.target.value)} onKeyPress={handleNameKeyPress} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" required /></div>
                                    <div><label className="block text-sm font-medium text-slate-700">Last Name *</label><input type="text" value={individualRunner.lastName} onChange={e => handleIndividualChange('lastName', e.target.value)} onKeyPress={handleNameKeyPress} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" required /></div>
                                    <div><label className="block text-sm font-medium text-slate-700">Parent / Emergency Name *</label><input type="text" value={individualRunner.parentName} onChange={e => handleIndividualChange('parentName', e.target.value)} onKeyPress={handleNameKeyPress} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" required /></div>
                                    <div><label className="block text-sm font-medium text-slate-700">Parent / Emergency Number *</label><input maxLength="10" type="tel" value={individualRunner.parentPhone} onChange={e => handleIndividualChange('parentPhone', e.target.value)} onKeyPress={handleNumberKeyPress} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" required /></div>
                                    <div><label className="block text-sm font-medium text-slate-700">Email Address *</label><input type="email" value={individualRunner.email} onChange={e => handleIndividualChange('email', e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" required /></div>
                                    <div><label className="block text-sm font-medium text-slate-700">Phone Number *</label><input maxLength="10" type="tel" value={individualRunner.phone} onChange={e => handleIndividualChange('phone', e.target.value)} onKeyPress={handleNumberKeyPress} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" required /></div>
                                    <div><label className="block text-sm font-medium text-slate-700">WhatsApp Number</label><input maxLength="10" type="tel" placeholder="If different from phone" value={individualRunner.whatsapp} onChange={e => handleIndividualChange('whatsapp', e.target.value)} onKeyPress={handleNumberKeyPress} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /></div>
                                    <div><label className="block text-sm font-medium text-slate-700">Date of Birth *</label><input type="date" value={individualRunner.dob} onChange={e => handleIndividualChange('dob', e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" required max={today} /></div>
                                    <div><label className="block text-sm font-medium text-slate-700">Gender *</label><select value={individualRunner.gender} onChange={e => handleIndividualChange('gender', e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white" required><option value="">Select gender</option>{genders.map(g => <option key={g} value={g}>{g}</option>)}</select></div>
                                    <div><label className="block text-sm font-medium text-slate-700">Blood Group *</label><select value={individualRunner.bloodGroup} onChange={e => handleIndividualChange('bloodGroup', e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white" required><option value="">Select blood group</option>{bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}</select></div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700">Nationality *</label>
                                        <select
                                            value={individualRunner.nationality}
                                            onChange={e => handleIndividualChange('nationality', e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50"
                                            required
                                        >
                                            <option value="">Select nationality</option>
                                            {nationalitiesISO.map((country) => (
                                                <option key={country} value={country}>{country}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Address Information */}
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-6">
                                <h2 className="text-xl font-semibold text-slate-900">Address Information</h2>
                                <p className="text-sm text-slate-500">Your current residential address</p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2"><label className="block text-sm font-medium text-slate-700">Complete Address *</label><textarea rows={2} value={individualRunner.address} onChange={e => handleIndividualChange('address', e.target.value)} placeholder="House/Flat No., Street, Area" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" required /></div>
                                    <div><label className="block text-sm font-medium text-slate-700">City *</label><input type="text" value={individualRunner.city} onChange={e => handleIndividualChange('city', e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" required /></div>
                                    <div><label className="block text-sm font-medium text-slate-700">State *</label><select value={individualRunner.state} onChange={e => handleIndividualChange('state', e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white" required><option value="">Select state</option>{statesInIndia.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                                    <div><label className="block text-sm font-medium text-slate-700">Pincode *</label><input type="text" maxLength="6" value={individualRunner.pincode} onChange={e => handleIndividualChange('pincode', e.target.value)} onKeyPress={handleNumberKeyPress} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" required /></div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700">Country *</label>
                                        <input
                                            type="text"
                                            value={individualRunner.country}
                                            onChange={e => handleIndividualChange('country', e.target.value)} // Enable typing
                                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50"
                                            placeholder="Enter your country"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
                                <IdUploadBlock idType={individualRunner.idType} idNumber={individualRunner.idNumber} idFile={individualRunner.idFile} handleTypeChange={handleIndividualChange} handleNumberChange={handleIndividualChange} handleFileChange={handleIndividualChange} sectionId="ind-id" />
                            </div>

                            {/* Runner Information */}
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-6">
                                <h2 className="text-xl font-semibold text-slate-900">Runner Information</h2>
                                <p className="text-sm text-slate-500">Help us better understand your running profile</p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div><label className="block text-sm font-medium text-slate-700">Previous Marathon Experience *</label><select value={individualRunner.experience} onChange={e => handleIndividualChange('experience', e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white" required><option value="">Select experience level</option><option value="Beginner">Beginner (0-1 Marathons)</option><option value="Intermediate">Intermediate (2-5 Marathons)</option><option value="Pro">Pro (6+ Marathons)</option></select></div>
                                    <div><label className="block text-sm font-medium text-slate-700">Expected Finish Time</label><input type="text" placeholder="e.g., 4:30:00" value={individualRunner.finishTime} onChange={e => handleIndividualChange('finishTime', e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /></div>
                                    <div className="md:col-span-2"><label className="block text-sm font-medium text-slate-700">Dietary Restrictions</label><input type="text" placeholder="Vegetarian, Vegan, Allergies, etc." value={individualRunner.dietary} onChange={e => handleIndividualChange('dietary', e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /></div>
                                </div>

                                {/* Referral Code Box */}
                                {/* Modern Ticket-Style Coupon Section */}
                                <div className="mt-8 relative overflow-hidden rounded-3xl border-2 border-dashed border-slate-200 bg-linear-to-br from-white to-slate-50/40 p-6 transition-all duration-300 hover:border-teal-400">
                                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-50 rounded-full border-r-2 border-dashed border-slate-200 hidden md:block"></div>
                                    <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-50 rounded-full border-l-2 border-dashed border-slate-200 hidden md:block"></div>

                                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-2">
                                        <div className="text-center md:text-left flex-1">
                                            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                                <span className="text-2xl">🎟️</span>
                                                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                                                    Coupon Code Discount
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="w-full md:w-auto">
                                            <div className="relative w-full md:w-64 group">
                                                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-1 tracking-tighter">
                                                    Enter Code Here
                                                </label>
                                                <div className="relative">
                                                    {(() => {
                                                        const enteredCode = individualRunner.referralCode;
                                                        const isFlat = enteredCode === COUPON_CODE_FLAT;
                                                        const isPercent = PERCENT_COUPONS.includes(enteredCode);
                                                        const isCouponValid = isFlat || isPercent;

                                                        // Minimal check: Error if typed text doesn't match the start of any valid code
                                                        const allValid = [COUPON_CODE_FLAT, ...PERCENT_COUPONS];
                                                        const isIncorrect = enteredCode.length > 0 &&
                                                            !isCouponValid &&
                                                            !allValid.some(c => c.startsWith(enteredCode));

                                                        return (
                                                            <>
                                                                <input
                                                                    type="text"
                                                                    placeholder="e.g. SAVE10"
                                                                    value={enteredCode}
                                                                    onChange={(e) => handleIndividualChange('referralCode', e.target.value.toUpperCase().trim())}
                                                                    className={`w-full rounded-2xl border-2 py-3 px-4 text-sm font-black tracking-widest transition-all outline-none uppercase ${isCouponValid
                                                                        ? "border-teal-500 bg-teal-50 text-teal-700 shadow-sm shadow-teal-100"
                                                                        : isIncorrect
                                                                            ? "border-rose-400 bg-rose-50 text-rose-700"
                                                                            : "border-slate-200 focus:border-teal-500 bg-white"
                                                                        }`}
                                                                />
                                                                {isCouponValid && (
                                                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-teal-600 font-bold animate-bounce">
                                                                        ✓
                                                                    </span>
                                                                )}
                                                                {isFlat && (
                                                                    <p className="text-[10px] text-teal-600 font-bold mt-1.5 ml-1 text-left">
                                                                        Flat ₹100 Discount Applied!
                                                                    </p>
                                                                )}
                                                                {isPercent && (
                                                                    <p className="text-[10px] text-teal-600 font-bold mt-1.5 ml-1 text-left">
                                                                        {Math.round(discountPercent)}% Discount Applied!
                                                                    </p>
                                                                )}

                                                                {/* Error message for incorrect entry/typo */}
                                                                {isIncorrect && (
                                                                    <p className="text-[10px] text-rose-600 font-bold mt-1.5 ml-1 text-left">
                                                                        ⚠️ Please enter a correct coupon code.
                                                                    </p>
                                                                )}
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Race Kit & Additional Services */}
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-6">
                                <h2 className="text-xl font-semibold text-slate-900">Race Kit & Additional Services</h2>
                                <div className="max-w-xs relative">
                                    <label className="block text-sm font-medium text-slate-700">T-Shirt Size * <button type="button" onClick={() => toggleSizeChart('ind')} className="text-teal-600 font-bold ml-1">ⓘ</button></label>
                                    {openPopoverId === 'ind' && <TShirtSizePopover isOpen={true} onClose={() => setOpenPopoverId(null)} />}
                                    <select value={individualRunner.tshirtSize} onChange={e => handleIndividualChange('tshirtSize', e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white" required><option value="">Select size</option>{getFilteredSizes(individualRunner.gender).map(s => <option key={s.value} value={s.value}>{s.label}</option>)}</select>
                                </div>
                                <div className="space-y-2 mt-4">
                                    <label className="flex items-center gap-3 text-sm text-slate-700 cursor-pointer">
                                        <input type="checkbox" checked={individualRunner.needAccommodation} onChange={e => handleIndividualChange('needAccommodation', e.target.checked)} className="h-4 w-4 rounded border-slate-300" />
                                        I need accommodation assistance
                                    </label>
                                    <label className="flex items-center gap-3 text-sm text-slate-700 cursor-pointer">
                                        <input type="checkbox" checked={individualRunner.needTransportation} onChange={e => handleIndividualChange('needTransportation', e.target.checked)} className="h-4 w-4 rounded border-slate-300" />
                                        I need transportation assistance
                                    </label>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Charity Participant Information (UPDATED with constraints) */}
                    {/* charity section */}
                    {registrationType === "charity" && (
                        <div id="charity-section" className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-6">
                            <div className="flex items-center gap-2">
                                <span className="text-teal-600 text-xl">🏃‍♀️</span>
                                <h2 className="text-xl font-semibold text-slate-900">Charity Participant Information</h2>
                            </div>
                            <p className="text-sm text-slate-500 mt-1">Please provide your details and confirm charity commitment.</p>

                            {/* Donation Acknowledgement Checkbox (Targeted for scroll) */}
                            <div id="charity-donation-ack-wrapper" className="p-4 rounded-xl border border-rose-300 bg-rose-50">
                                <label className="flex items-center gap-3 text-sm font-semibold text-rose-700">
                                    <input
                                        type="checkbox"
                                        checked={charityParticipant.isDonationAcknowledged}
                                        onChange={(e) => handleCharityParticipantChange('isDonationAcknowledged', e.target.checked)}
                                        className="mt-1 h-4 w-4 rounded border-rose-500 text-rose-600 focus:ring-rose-500"
                                        required
                                    />
                                    <span>I understand that a portion of my registration fee will be donated to charity and is non-refundable. *</span>
                                </label>
                            </div>

                            {/* Normal Runner Details (UPDATED with constraints) */}
                            <div className="mt-6 grid md:grid-cols-2 gap-4">
                                {/* First Name */}
                                <div id="charity-firstName-wrapper"><label className="block text-sm font-medium text-slate-700 mb-1">First Name *</label><input type="text" value={charityParticipant.firstName} onChange={(e) => handleCharityParticipantChange('firstName', e.target.value)} onKeyPress={handleNameKeyPress} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50" required id="charity-firstName" /></div>
                                {/* Last Name */}
                                <div id="charity-lastName-wrapper"><label className="block text-sm font-medium text-slate-700 mb-1">Last Name *</label><input type="text" value={charityParticipant.lastName} onChange={(e) => handleCharityParticipantChange('lastName', e.target.value)} onKeyPress={handleNameKeyPress} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50" required id="charity-lastName" /></div>

                                {/* Gender */}
                                <div id="charity-gender-wrapper"><label className="block text-sm font-medium text-slate-700 mb-1">Gender *</label><select value={charityParticipant.gender} onChange={(e) => handleCharityParticipantChange('gender', e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50" required id="charity-gender">
                                    <option value="">Select gender</option>
                                    {genders.map((g) => <option key={g} value={g}>{g}</option>)}
                                </select>
                                </div>
                                {/* DOB */}
                                <div id="charity-dob-wrapper"><label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth *</label><input type="date" value={charityParticipant.dob} onChange={(e) => handleCharityParticipantChange('dob', e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50" required max={today} id="charity-dob" /></div>

                                {/* Mobile Number */}
                                <div id="charity-phone-wrapper"><label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number *</label><input minLength="10" maxLength="10" type="tel" pattern="[0-9]{6,}" value={charityParticipant.phone} onChange={(e) => handleCharityParticipantChange('phone', e.target.value)} onKeyPress={handleNumberKeyPress} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50" required id="charity-phone" /></div>
                                {/* Email ID */}
                                <div id="charity-email-wrapper"><label className="block text-sm font-medium text-slate-700 mb-1">Email ID *</label><input type="email" value={charityParticipant.email} onChange={(e) => handleCharityParticipantChange('email', e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50" required id="charity-email" /></div>

                                {/* City */}
                                <div id="charity-city-wrapper"><label className="block text-sm font-medium text-slate-700 mb-1">City *</label><input type="text" value={charityParticipant.city} onChange={(e) => handleCharityParticipantChange('city', e.target.value)} onKeyPress={handleNameKeyPress} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50" required id="charity-city" /></div>
                                {/* State */}
                                <div id="charity-state-wrapper"><label className="block text-sm font-medium text-slate-700 mb-1">State *</label><select value={charityParticipant.state} onChange={(e) => handleCharityParticipantChange('state', e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50" required id="charity-state">
                                    <option value="">Select state</option>
                                    {statesInIndia.map((state) => <option key={state} value={state}>{state}</option>)}
                                </select>
                                </div>

                                {/* Emergency Contact Name */}
                                <div id="charity-emergencyName-wrapper"><label className="block text-sm font-medium text-slate-700 mb-1">Emergency Contact Name *</label><input type="text" value={charityParticipant.emergencyName} onChange={(e) => handleCharityParticipantChange('emergencyName', e.target.value)} onKeyPress={handleNameKeyPress} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50" required id="charity-emergencyName" /></div>
                                {/* Emergency Contact Number */}
                                <div id="charity-emergencyPhone-wrapper"><label className="block text-sm font-medium text-slate-700 mb-1">Emergency Contact Number *</label><input minLength="10" maxLength="10" type="tel" pattern="[0-9]{6,}" value={charityParticipant.emergencyPhone} onChange={(e) => handleCharityParticipantChange('emergencyPhone', e.target.value)} onKeyPress={handleNumberKeyPress} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50" required id="charity-emergencyPhone" /></div>
                                {/* newaddedline */}
                                <div className="md:col-span-2" id="charity-address-wrapper">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Complete Address *</label>
                                    <textarea rows={2} value={charityParticipant.address} onChange={e => handleCharityParticipantChange('address', e.target.value)} placeholder="House/Flat No., Street, Area" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" required id="charity-address" />
                                </div>

                                <div id="charity-pincode-wrapper">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Pincode *</label>
                                    <input type="text" maxLength="6" value={charityParticipant.pincode} onChange={e => handleCharityParticipantChange('pincode', e.target.value)} onKeyPress={handleNumberKeyPress} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" required id="charity-pincode" />
                                </div>

                                {/* newaddedline */}
                                {/* Nationality */}
                                {/* --- National Identity Card Upload Section --- */}
                                {/* <div className="md:col-span-2">
                                    <h4 className="text-md font-semibold text-slate-800 mt-4 mb-2 border-t pt-4">
                                        National Identity Card Upload *
                                    </h4>
                                </div> */}

                                {/* 1. Nationality comes first in this section */}
                                <div id="charity-nationality-wrapper">
                                    <label className="block text-sm font-medium text-slate-700 mb-1 ">Nationality *</label>
                                    <select
                                        value={charityParticipant.nationality}
                                        onChange={(e) => handleCharityParticipantChange('nationality', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50"
                                        required
                                        id="charity-nationality"
                                    >
                                        <option value="">Select your nationality</option>
                                        {nationalitiesISO.map((country) => (
                                            <option key={country} value={country}>{country}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* 2. ID Upload Block follows (ID Type, Number, and File) */}
                                <IdUploadBlock
                                    idType={charityParticipant.idType}
                                    idNumber={charityParticipant.idNumber}
                                    idFile={charityParticipant.idFile}
                                    handleTypeChange={(field, value) => handleCharityParticipantChange(field, value)}
                                    handleNumberChange={(field, value) => handleCharityParticipantChange(field, value)}
                                    handleFileChange={(field, file) => handleCharityParticipantChange(field, file)}
                                    sectionId="charity"
                                />
                                {/* END ADDED: ID Upload Block */}

                            </div>

                            {/* Charity Partner & Cause Selection (Unchanged) */}


                            <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    {/* Cause Selection */}
                                    <div id="charity-cause-wrapper"><label className="block text-sm font-medium text-slate-700 mb-1">Cause Selection *</label><select value={charityParticipant.cause} onChange={(e) => handleCharityParticipantChange('cause', e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50" required id="charity-cause"><option value="">Select cause</option>{causeOptions.map((cause) => <option key={cause} value={cause}>{cause}</option>)}</select></div>
                                </div>

                                {/* Optional Message / Dedication (Unchanged) */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Optional Message / Dedication</label>
                                    <textarea rows={2} value={charityParticipant.dedication} onChange={(e) => handleCharityParticipantChange('dedication', e.target.value)} placeholder="e.g., Running in memory of my grandmother..." className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50" />
                                </div>

                                {/* T-Shirt Size Selection for Charity */}

                                <div className="md:col-span-2 md:max-w-xs relative" id="charity-tshirtSize-wrapper">
                                    <label className="text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                                        T-Shirt Size *
                                        <button
                                            type="button"
                                            onClick={() => toggleSizeChart('charity')}
                                            className="text-teal-600 hover:text-teal-800 text-lg font-bold ml-1"
                                            aria-label="View T-Shirt Size Chart"
                                        >
                                            ⓘ
                                        </button>
                                    </label>

                                    {openPopoverId === 'charity' && (
                                        <TShirtSizePopover
                                            isOpen={true}
                                            onClose={() => setOpenPopoverId(null)}
                                        />
                                    )}

                                    <select
                                        value={charityParticipant.tshirtSize}
                                        onChange={(e) => handleCharityParticipantChange('tshirtSize', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50"
                                        required
                                        id="charity-tshirtSize"
                                    >
                                        <option value="">Select size</option>
                                        {/* Uses the helper function to show Male/Female specific chest measurements */}
                                        {getFilteredSizes(charityParticipant.gender).map((size) => (

                                            <option key={size.size} value={size.value}>
                                                {size.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Donation Acknowledgement Checkbox (Targeted for scroll) */}
                            <div className="pt-4 mt-4 border-t border-slate-100">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Donation Acknowledgement</label>
                                <label className="flex items-start gap-3 text-sm text-slate-700">
                                    <input
                                        type="checkbox"
                                        checked={charityParticipant.isDonationAcknowledged}
                                        onChange={(e) => handleCharityParticipantChange('isDonationAcknowledged', e.target.checked)}
                                        className="mt-1 h-4 w-4 rounded border-rose-500 text-rose-600 focus:ring-rose-500"
                                        required
                                    />
                                    <span>I understand that a portion of my registration fee will be donated to charity and is non-refundable. *</span>
                                </label>
                            </div>

                        </div>
                    )}

                    {/* Group Registration Details (UPDATED with constraints & QueryBox fix) */}
                    {/* group section */}
                    {registrationType === "group" && (
                        <div id="group-registration-details" className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
                            <h2 className="text-xl font-semibold text-slate-900">Group Registration Details</h2>
                            <p className="text-sm text-slate-500 mt-1">Enter details for all group members. Tiered discounts apply for 10, or 25+ members.</p>

                            {/* NEW: Warning message for groups over limit */}
                            {memberCount > MAX_GROUP_MEMBERS && (
                                <div id="group-limit-message" className="my-4 p-3 rounded-xl border border-rose-500 bg-rose-50 text-rose-800 text-sm font-semibold">
                                    Your group size ({memberCount}) exceeds the standard limit ({MAX_GROUP_MEMBERS} members). To become a community partner and receive custom pricing, please contact us at: **registration@sprintssagaindia.com**. (Email available on footer)
                                </div>
                            )}

                            <div className="mt-6 grid md:grid-cols-[2fr,1fr,auto] gap-4 items-end">
                                <div id="groupName-wrapper"><label className="block text-sm font-medium text-slate-700 mb-1">Group Name *</label><input type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)} onKeyPress={handleNameKeyPress} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50" required id="groupName" /></div>
                                <div><label className="block text-sm font-medium text-slate-700 mb-1">Number of Members</label><div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setMemberCount(memberCount - 1)}
                                        className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-slate-200 bg-white text-slate-700"
                                        aria-label="Decrease members"
                                        disabled={memberCount <= 1} // Disable if only 1 member left
                                    >−</button>
                                    <input
                                        type="number"
                                        min={1}
                                        max={MAX_GROUP_MEMBERS}
                                        value={groupMembers.length}
                                        // *** FIX 1: Pass raw value to handle deletions gracefully ***
                                        onChange={(e) => setMemberCount(e.target.value)}
                                        className="w-20 text-center rounded-xl border border-slate-200 px-3 py-2 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setMemberCount(memberCount + 1)}
                                        className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-slate-200 bg-white text-slate-700"
                                        aria-label="Increase members"
                                        // Disable if hitting the max limit
                                        disabled={memberCount >= MAX_GROUP_MEMBERS}
                                    >+</button>
                                </div><p className="text-xs text-slate-500 mt-1">Group leader can set number of members. Maximum {MAX_GROUP_MEMBERS}.</p></div>
                                <div className="flex md:justify-end">
                                    <button type="button" onClick={handleAddMember} disabled={memberCount >= MAX_GROUP_MEMBERS} className={`inline-flex items-center rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 ${memberCount >= MAX_GROUP_MEMBERS ? 'opacity-50 cursor-not-allowed' : ''}`}>Add Member</button>
                                </div>
                            </div>

                            <div className="mt-6 space-y-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-4 md:p-5">
                                {groupMembers.map((member, index) => (
                                    <div key={index} className="border border-slate-200 rounded-2xl bg-white p-4 md:p-5">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-semibold text-slate-900">Member {index + 1} - {raceCategories.find(r => r.id === member.raceId)?.name || 'Select Race'}</h3>
                                            {groupMembers.length > 1 && (<button type="button" onClick={() => handleRemoveMember(index)} className="text-xs text-rose-600 hover:underline" title={`Remove member ${index + 1}`}>Remove</button>)}
                                        </div>
                                        <div className="grid md:grid-cols-4 gap-4 mb-4 items-start">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1 min-h-5">Race Category *</label>
                                                <select
                                                    value={member.raceId}
                                                    onChange={(e) => handleMemberChange(index, "raceId", e.target.value)}
                                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50"
                                                    required
                                                >
                                                    <option value="">Select race</option>
                                                    {raceCategories.map((race) => (
                                                        <option key={race.id} value={race.id}>
                                                            {race.name} (Reg: ₹{race.regularPrice})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            {/* Name Inputs (Enforced letters) */}
                                            <div><label className="block text-sm font-medium text-slate-700 mb-1">First Name *</label><input type="text" value={member.firstName} onChange={(e) => handleMemberChange(index, "firstName", e.target.value)} onKeyPress={handleNameKeyPress} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50" required /></div>
                                            <div><label className="block text-sm font-medium text-slate-700 mb-1">Last Name *</label><input type="text" value={member.lastName} onChange={(e) => handleMemberChange(index, "lastName", e.target.value)} onKeyPress={handleNameKeyPress} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50" required /></div>
                                            <div><label className="block text-sm font-medium text-slate-700 mb-1">Email *</label><input type="email" value={member.email} onChange={(e) => handleMemberChange(index, "email", e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50" required /></div>
                                        </div>
                                        <div className="grid md:grid-cols-4 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth *</label>
                                                <input type="date" value={member.dob} onChange={(e) => handleMemberChange(index, "dob", e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" required max={today} />
                                            </div>
                                            {/* Phone (Enforced numbers) */}
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Blood Group *</label>
                                                <select
                                                    value={member.bloodGroup || ""}
                                                    onChange={(e) => handleMemberChange(index, "bloodGroup", e.target.value)}
                                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50"
                                                    required
                                                >
                                                    <option value="">Select blood group</option>
                                                    {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                                </select>
                                            </div>
                                            <div><label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label><input minLength="10" maxLength="10" type="tel" pattern="[0-9]{6,}" value={member.phone} onChange={(e) => handleMemberChange(index, "phone", e.target.value)} onKeyPress={handleNumberKeyPress} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50" required /></div>
                                            <div><label className="block text-sm font-medium text-slate-700 mb-1">Gender *</label><select value={member.gender} onChange={(e) => handleMemberChange(index, "gender", e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50" required><option value="">Select gender</option>{genders.map((g) => (<option key={g} value={g}>{g}</option>))}</select></div>
                                            {/* T-Shirt Size */}
                                            <div className="relative">
                                                <label className=" flex text-sm font-medium text-slate-700 mb-1 min-h-5  items-center gap-1">
                                                    T-Shirt Size *
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleSizeChart(`group-${index}`)} // Use a unique ID for each member
                                                        className="text-teal-600 hover:text-teal-800 text-lg font-bold ml-1"
                                                        aria-label="View T-Shirt Size Chart"
                                                    >
                                                        ⓘ
                                                    </button>
                                                </label>
                                                {/* Popover for Group Member */}
                                                {openPopoverId === `group-${index}` && (
                                                    <TShirtSizePopover isOpen={true} onClose={() => setOpenPopoverId(null)} />
                                                )}
                                                <select value={member.tshirtSize} onChange={(e) => handleMemberChange(index, "tshirtSize", e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50" required>
                                                    <option value="">Select size</option>
                                                    {/* DYNAMIC SIZE OPTIONS */}
                                                    {getFilteredSizes(member.gender).map((size) => (
                                                        <option key={size.size} value={size.value}>
                                                            {size.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            {/* END T-Shirt Size Size - MODIFIED FOR GROUP MEMBERS */}
                                            {/* <div className="md:col-span-4 border-t border-slate-200 my-4"></div> */}

                                        </div>
                                        {/* Member 1 Specific Fields: Parent, City, State, Country, Pincode */}
                                        {index === 0 && (
                                            <div className="grid md:grid-cols-2 gap-4 mt-4">
                                                <div><label className="block text-sm font-medium text-slate-700">WhatsApp Number *</label><input maxLength="10" type="tel" placeholder="If different from phone" value={member.whatsapp || ""} onChange={(e) => handleMemberChange(index, "whatsapp", e.target.value)} onKeyPress={handleNumberKeyPress} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" required /></div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Parent / Emergency Name *</label>
                                                    <input
                                                        type="text"
                                                        value={member.parentName || ""}
                                                        onChange={(e) => handleMemberChange(index, "parentName", e.target.value)}
                                                        onKeyPress={handleNameKeyPress}
                                                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Parent / Emergency Number *</label>
                                                    <input
                                                        type="tel"
                                                        maxLength="10"
                                                        value={member.parentPhone || ""}
                                                        onChange={(e) => handleMemberChange(index, "parentPhone", e.target.value)}
                                                        onKeyPress={handleNumberKeyPress}
                                                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">City *</label>
                                                    <input
                                                        type="text"
                                                        value={member.city || ""}
                                                        onChange={(e) => handleMemberChange(index, "city", e.target.value)}
                                                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Pincode *</label>
                                                    <input
                                                        type="text"
                                                        maxLength="6"
                                                        value={member.pincode || ""}
                                                        onChange={(e) => handleMemberChange(index, "pincode", e.target.value)}
                                                        onKeyPress={handleNumberKeyPress}
                                                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">State *</label>
                                                    <select
                                                        value={member.state || ""}
                                                        onChange={(e) => handleMemberChange(index, "state", e.target.value)}
                                                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white shadow-sm"
                                                        required
                                                    >
                                                        <option value="">Select state</option>
                                                        {statesInIndia.map(s => <option key={s} value={s}>{s}</option>)}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Country *</label>
                                                    <input
                                                        type="text"
                                                        value={member.country || ""}
                                                        onChange={(e) => handleMemberChange(index, "country", e.target.value)}
                                                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm"
                                                        required
                                                    />
                                                </div>
                                                <div>{index === 0 && (<div id="group-nationality-wrapper"><label className="block text-sm font-medium text-slate-700 mb-1">Nationality *
                                                </label><select value={member.nationality} onChange={(e) => handleMemberChange(index, "nationality", e.target.value)}
                                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50"
                                                    required id="group-nationality"><option value="">Select nationality</option>
                                                        {nationalitiesISO.map((country) => (<option key={country} value={country}>{country}</option>))}</select></div>)}</div>
                                            </div>
                                        )}


                                        {/* ADDED: ID Upload Block for Group Leader (Member 1) (Unchanged) */}
                                        {index === 0 && (
                                            <>

                                                <IdUploadBlock
                                                    idType={member.idType}
                                                    idNumber={member.idNumber}
                                                    idFile={member.idFile}
                                                    handleTypeChange={(field, value) => handleMemberChange(index, field, value)}
                                                    handleNumberChange={(field, value) => handleMemberChange(index, field, value)}
                                                    handleFileChange={(field, file) => handleMemberChange(index, field, file)}
                                                    sectionId={`group-id-${index}`}
                                                />

                                                {/* CORRECTED ADDRESS AND QUERY BOX FIELDS */}
                                                <div className="mt-4" id="group-address-wrapper">
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Address *</label>
                                                    <textarea
                                                        rows={2}
                                                        value={member.address}
                                                        onChange={(e) => handleMemberChange(index, "address", e.target.value)}
                                                        placeholder="House/Flat No., Street, Area, City"
                                                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50"
                                                        required
                                                        id="group-address"
                                                    />

                                                    <label className="block text-sm font-medium text-slate-700 mb-1 mt-4">Query Box </label>
                                                    <textarea
                                                        rows={2}
                                                        value={member.queryBox}
                                                        onChange={(e) => handleMemberChange(index, "queryBox", e.target.value)}
                                                        placeholder="For any query write here will try to solve them."
                                                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50"
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Registration Summary & CTA (ADD-ONS REMOVED & DISCOUNT % ADDED) */}
                    <div className="bg-linear-to-br from-cyan-50 to-white rounded-3xl shadow-sm border border-cyan-100 p-6 md:p-8">
                        <h2 className="text-xl font-semibold text-slate-900">Registration Summary</h2>

                        <div className="mt-4 text-sm space-y-2">
                            <div className="flex justify-between">
                                <span className="text-slate-600">Registration Type:</span>
                                <span className="font-semibold text-slate-900 capitalize">{registrationType.replace("individual", "Individual").replace("group", "Group").replace("charity", "Charity")}</span>
                            </div>

                            {/* Race Category Display for Individual/Charity */}
                            {(registrationType === "individual" || registrationType === "charity") && selectedRace && (
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Race Category:</span>
                                    <span className="font-semibold text-slate-900">{selectedRace.name}</span>
                                </div>
                            )}

                            {/* Group Members Breakdown (Display selected races/counts) */}
                            {registrationType === "group" && raceSummary && (
                                <>
                                    <div className="flex justify-between font-semibold text-slate-800 pt-2">
                                        <span>Group Members:</span>
                                        <span>{memberCount}</span>
                                    </div>
                                    {raceSummary.map(([name, count]) => (
                                        <div key={name} className="flex justify-between pl-4 text-xs text-slate-500">
                                            <span>- {name} registrations:</span>
                                            <span className="font-semibold">{count}</span>
                                        </div>
                                    ))}
                                </>
                            )}
                            {/* End Group Members Breakdown */}

                            {/* The fees below should only show if a race is selected */}
                            {raceIsSelected && (
                                <>
                                    {/* 1. Registration Fee (Base Price) */}
                                    {rawRegistrationFee > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Registration Fee:</span>
                                            <span className="font-semibold text-slate-900">₹{rawRegistrationFee.toFixed(2)}</span>
                                        </div>
                                    )}

                                    {/* 2. Discount Line */}
                                    {discountAmount > 0 && (
                                        <>
                                            <div className="flex justify-between text-green-600 italic">
                                                <span className="pl-4">
                                                    {registrationType === "individual"
                                                        ? `Coupon Discount (${Math.round(discountPercent)}%)`
                                                        : `Group Discount (${discountPercent}%)`}
                                                    :
                                                </span>
                                                <span className="font-semibold">–₹{discountAmount.toFixed(2)}</span>
                                            </div>

                                            {/* NEW: Discounted Registration Fee Subtotal */}
                                            <div className="flex justify-between text-slate-900 font-bold bg-slate-100/50 px-1 py-2 rounded-xl border border-slate-200/50">
                                                <span className="flex items-center gap-1">
                                                    <span className="text-teal-600 text-xs">●</span>
                                                    Net Registration Fee
                                                </span>
                                                <span className="pr-0">₹{(rawRegistrationFee - discountAmount).toFixed(2)}</span>
                                            </div>
                                        </>
                                    )}

                                    {/* 3. Platform Fee (Non-taxable) */}
                                    {platformFee > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Platform Fee:</span>
                                            <span className="font-semibold text-slate-900">₹{platformFee.toFixed(2)}</span>
                                        </div>
                                    )}

                                    {/* 4. Payment Gateway Fee (PG Fee) */}
                                    {pgFee > 0 && (
                                        <div className="flex justify-between text-slate-700 pt-2 border-t border-dashed border-slate-200">
                                            <span className="pl-4">Payment Gateway Fee :</span>
                                            <span>₹{pgFee.toFixed(2)}</span>
                                        </div>
                                    )}

                                    {/* 5. GST (on PG Fee) */}
                                    {gstAmount > 0 && (
                                        <div className="flex justify-between text-slate-700">
                                            <span className="pl-4">GST @{GST_RATE * 100}% (on PG Fee):</span>
                                            <span>₹{gstAmount.toFixed(2)}</span>
                                        </div>
                                    )}
                                </>
                            )}

                            <div className="pt-3 mt-2 border-t-2 border-slate-700 flex justify-between items-center">
                                <span className="text-xl font-extrabold text-slate-900">Total Payable:</span>
                                <span className="text-2xl font-extrabold text-teal-700">₹{totalAmountPayable.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="mt-5 text-sm text-slate-600">
                            <p className="font-semibold mb-2">Registration fee includes:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Race Kit (Participant Bib & Official Event T-Shirt)</li>
                                <li>Finisher medal</li>
                                <li>Refreshments During the Race</li>
                                <li>Digital Certificate</li>
                            </ul>
                        </div>


                    </div>
                </form>
                {/* <div className="mt-8 flex justify-center sticky">
                    <button
                        type="submit"
                        className={`cursor-pointer inline-flex items-center justify-center rounded-full bg-linear-to-r from-teal-600 to-cyan-500 px-16 py-3 text-sm md:text-base font-semibold text-white shadow-lg shadow-teal-500/30 hover:from-teal-700 hover:to-cyan-600 focus-visible:outline-none focus-visible:ring-2 focus:ring-teal-500 focus-visible:ring-offset-2 whitespace-nowrap ${buttonDisabled || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={buttonDisabled || isSubmitting} // Use both conditions here
                    >
                        {buttonText}
                    </button>
                </div> */}
                {/* 🔒 Sticky Bottom CTA */}
                <div className="fixed bottom-0 left-0 right-0 z-50  px-4 py-3">
                    <div className="max-w-6xl mx-auto flex justify-center">
                        <button
                            type="button"
                            onClick={handleProceedToPayment}
                            disabled={buttonDisabled || isSubmitting}
                            className={`
                w-full md:w-auto
                cursor-pointer
                inline-flex items-center justify-center
                rounded-full
                bg-linear-to-r from-teal-600 to-cyan-500
                px-10 md:px-16
                py-3
                text-sm md:text-base
                font-semibold text-white
                shadow-lg shadow-teal-500/30
                hover:from-teal-700 hover:to-cyan-600
                focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-teal-500
                focus-visible:ring-offset-2
                whitespace-nowrap
                ${buttonDisabled || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
            `}
                        >
                            {buttonText}
                        </button>
                    </div>
                </div>

            </section>

        </main>
    );
}

export default Register;
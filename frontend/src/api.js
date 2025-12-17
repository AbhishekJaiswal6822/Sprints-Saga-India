// frontend/src/api.js - FINAL VERSION WITH STRUCTURED ERROR PRESERVATION

// const API_BASE_URL = "https://ssi-testing-phase.onrender.com";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/**
 * Utility function to handle API calls, authentication, and different body types (JSON/FormData).
 * @param {string} path - The API endpoint path (e.g., "/api/auth/login")
 * @param {object} options - Options object.
 * @param {string} options.method - HTTP method (default: "GET").
 * @param {object|FormData} options.body - Request body.
 * @param {string} options.token - JWT token for Authorization header.
 */
export async function api(path, { method = "GET", body, token } = {}) {
    // Initialize fetch options
    const fetchOptions = {
        method: method,
        headers: {},
    };

    // Set Authorization header if a token is provided
    if (token) {
        fetchOptions.headers.Authorization = `Bearer ${token}`;
    }

    // --- CRITICAL FILE UPLOAD AND BODY HANDLING LOGIC ---
    if (body) {
        // 1. Check if the body is FormData (for file uploads)
        if (body instanceof FormData) {
            // For FormData, we must NOT set the 'Content-Type' header.
            fetchOptions.body = body;
        } else {
            // 2. Handle standard JSON body
            fetchOptions.headers["Content-Type"] = "application/json";
            fetchOptions.body = JSON.stringify(body);
        }
    }
    // --- END BODY HANDLING LOGIC ---


    const fullUrl = `${API_BASE_URL}${path}`;
    
    console.log(`[FRONTEND SENDING]: ${method} request to ${fullUrl}`);

    const res = await fetch(fullUrl, fetchOptions);
    
    // Attempt to read the response body as text
    const text = await res.text().catch(() => "");
    let data;
    try { 
        // Attempt to parse JSON
        data = text ? JSON.parse(text) : null; 
    } catch { 
        // If parsing fails, treat it as plain text message
        data = { message: text || res.statusText };
    }
    
    // --- CRITICAL FIX: THROW THE ENTIRE DATA OBJECT IF NOT OK ---
    if (!res.ok) {
        const errorMessage = data.message || res.statusText || "Request failed";
        // Throw the full error object containing all structured properties (errorCode, registrationId, etc.)
        const errorObject = { 
            status: res.status,
            message: errorMessage,
            ...data 
        };
        throw errorObject;
    }
    
    return data;
}
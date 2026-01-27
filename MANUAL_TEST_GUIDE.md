# SMS Authentication Manual Test Guide

Follow these steps to manually verify the SMS Authentication feature.

## Prerequisites
1.  **Backend Running**: Ensure the backend server is running (`cd backend && npm start`).
    -   *Note*: Ensure `SOLAPI_API_KEY` and `SOLAPI_API_SECRET` are set in `backend/.env` for real SMS, or rely on mock logs in the console.
2.  **Frontend Running**: Ensure the React app is running (`npm start`) and the proxy is active.

## Test Cases

### 1. Initial State
-   **Action**: Navigate to the Signup Page (e.g., `/signup-example` or where you mounted functionality).
-   **Check**:
    -   "Phone Verification" section is visible.
    -   "Sign Up" button is **Disabled** (Grayed out).
    -   Account details section is blurred/disabled.

### 2. Phone Input & Formatting
-   **Action**: Type `01012345678` into the phone input.
-   **Check**:
    -   Input automatically formats to `010-1234-5678`.
    -   "Send Verification Code" button becomes **Enabled** only after sufficient length.

### 3. Sending SMS
-   **Action**: Click "Send Verification Code".
-   **Check**:
    -   Button shows loading spinner ("Processing...").
    -   Input field becomes disabled.
    -   **Backend Console**: Check terminal for `[DEV_LOG] Sending SMS to 01012345678: [CODE]`. Note this code.
    -   **UI**:
        -   Moves to "Verification Code" step.
        -   Timer starts counting down from 3:00.
        -   Phone number is visible but read-only.
        -   "Change" button is visible next to phone number.

### 4. Verification Logic
-   **Action (Invalid Code)**: Type `0000` and click "Verify".
-   **Check**: Error message "Invalid verification code" appears.
-   **Action (Valid Code)**: Type the code from the backend console (e.g., `1234`) and click "Verify".
-   **Check**:
    -   Success message "Verification Complete" appears with a green checkmark.
    -   "Sign Up" button becomes **Enabled**.
    -   Account section becomes active (unblurred).
    -   Console logs "Phone verified successfully!".

### 5. Resend & Timer
-   **Action**: Reload page or click "Verify another number". Send SMS again. Wait for 3 minutes (or temporarily adjust timer in code to 5s for testing).
-   **Check**:
    -   When timer hits 0:00, "Resend Code" button appears.
    -   Clicking "Resend Code" restarts the process (new code sent, timer resets).

### 6. Rate Limiting (Backend Test)
-   **Action**: Try to send SMS more than 1 time within a minute.
-   **Check**: Error message "Too many requests. Please try again after 1 minute." appears.

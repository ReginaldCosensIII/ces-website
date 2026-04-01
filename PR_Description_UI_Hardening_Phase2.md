### Description
Final functional fixes to complete the UI hardening phase for the Seminar page, aligning the frontend form fields with the backend integration requirements and restoring the local error state UI logic.

### Key Changes
*   **Seminar Form Page (`seminar.html`):**
    *   Updated the Job Title `<input>` field's structure and ensured `autocomplete="organization-title"` matches expected attribute requirements.
*   **Seminar Form JS (`js/seminar-form.js`):**
    *   Verified the `title` payload matches the Backend's JSON contract `SmtpOptions`/Validator.
    *   Confirmed the global notification behavior has been reverted back to the scoped `showToast` method natively contained in the module.
    *   Ensured the catch block is using the scoped UI to appropriately alert users of Network errors.

### Testing Notes (Pre-Production IIS)
- [ ] Verify the Job Title autocomplete functions correctly in Chrome/Edge browsers.
- [ ] Submitting a form triggers the appropriate `/api/seminar/register` endpoint with the correct `title` payload.
- [ ] Test a failed submission (e.g. CORS or disconnected network) to ensure the localized error toast triggers.

### Pending Author Actions 
- [ ] Open Pull Request using this template on GitHub
- [ ] Delete `PR_Description_UI_Hardening_Phase2.md` post-merge

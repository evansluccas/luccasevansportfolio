
# Store Contact Form Submissions

## Overview
Create a simple database table to store all contact form submissions, then update the contact form to save data to it. You'll also be able to view submissions in an admin page.

## What Will Be Built

### 1. Database Table: `contact_submissions`
A new table to store:
- Name
- Email  
- Subject
- Message
- Submission date
- Read/unread status (optional, for tracking)

### 2. Update Contact Form
Modify the existing form to:
- Save submissions to the database
- Show success/error feedback
- Keep the current animated success message

### 3. Admin Page to View Submissions
Create a simple admin page where you can:
- View all contact submissions
- See when they were submitted
- Mark as read/delete if needed

## Security
- Public users can INSERT (submit the form)
- Only admins can read/manage submissions
- No login required to submit

---

## Technical Details

### Database Schema
```sql
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
-- Anyone can submit
CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions FOR INSERT
  WITH CHECK (true);

-- Only admins can read
CREATE POLICY "Admins can manage submissions"
  ON contact_submissions FOR ALL
  USING (has_role(auth.uid(), 'admin'));
```

### Files to Create/Modify
1. **Database migration** - Create the `contact_submissions` table
2. **`src/components/sections/ContactSection.tsx`** - Update `handleSubmit` to insert into database
3. **`src/pages/admin/AdminContactSubmissions.tsx`** - New admin page to view submissions
4. **`src/components/admin/AdminSidebar.tsx`** - Add navigation link
5. **`src/App.tsx`** - Add route for admin page

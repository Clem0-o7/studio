# PDF Upload System - Architecture Changes

## Overview
This document outlines the changes made to migrate from Firebase Storage to Supabase Storage for PDF uploads while maintaining Firebase Firestore for database operations.

## Key Changes

### 1. Storage Migration
- **Before**: Firebase Storage for PDF storage
- **After**: Supabase Storage for PDF storage
- **Database**: Firebase Firestore (unchanged)

### 2. New Files Created

#### `src/lib/supabasePdfUpload.js`
- Handles PDF uploads to Supabase Storage
- Validates file type (PDF only) and size (max 10MB)
- Creates organized file paths: `documents/{userId}/{timestamp}-{fileName}`
- Provides public URL access to uploaded files

#### `src/lib/firebaseService.js`
- Manages all Firebase Firestore operations
- Functions for CRUD operations on documents
- Maintains user associations, email, and metadata

### 3. Updated Components

#### Upload Page (`src/app/upload/page.tsx`)
- **Form validation**: Added PDF-only validation and file size limits
- **Upload process**: Uses Supabase for storage, Firebase for metadata
- **Error handling**: Comprehensive error handling for upload failures

#### Status Page (`src/app/status/page.tsx`)
- **Data source**: Migrated from mock data to Firebase Firestore
- **Real-time updates**: Fetches user-specific documents from database

#### Admin Dashboard (`src/app/admin/page.tsx`)
- **Data source**: Migrated from mock data to Firebase Firestore
- **Document management**: Real-time document list for admin review

#### Document Review (`src/app/admin/review/[id]/`)
- **PDF viewer**: Integrated iframe for PDF preview
- **Document updates**: Uses Firebase for status changes
- **Real-time sync**: Updates document status in real-time

### 4. Environment Variables
Uses existing environment variables from `.env`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Firebase configuration remains unchanged

### 5. Data Flow

#### Upload Process:
1. User selects PDF file
2. Client validates file (type, size)
3. File uploads to Supabase Storage
4. Metadata saves to Firebase Firestore
5. User receives confirmation

#### Review Process:
1. Admin views document list from Firebase
2. Clicks to review specific document
3. PDF loads from Supabase Storage URL
4. Admin approves/rejects (updates Firebase)
5. Status syncs across all views

### 6. Security Features
- **File validation**: PDF-only uploads, size limits
- **User association**: All files linked to authenticated users
- **Organized storage**: Files stored in user-specific folders
- **Public access**: Secure public URLs for document viewing

### 7. Benefits
- **Cost optimization**: Supabase Storage for file storage
- **Scalability**: Firebase Firestore for fast queries
- **User experience**: Direct PDF preview in admin interface
- **Maintainability**: Separation of concerns between storage and database
- **Authentication**: Leverages existing Firebase Auth integration

## Dependencies
- `@supabase/supabase-js` for Supabase client
- Existing Firebase dependencies remain unchanged
- All UI components and authentication logic preserved

## Future Enhancements
- File compression for large PDFs
- Batch upload capabilities
- Advanced document preview features
- Automated document processing workflows

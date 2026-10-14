import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { FileUpload, ImageUpload, DocumentUpload } from '../upload';

describe('Shared UI Upload Suite', () => {
  describe('FileUpload', () => {
    it('renders drag-and-drop zone with label and custom description', () => {
      const html = renderToStaticMarkup(
        <FileUpload
          label="Project Attachments"
          description="PDF or ZIP archives up to 25MB"
        />,
      );

      expect(html).toContain('Project Attachments');
      expect(html).toContain('PDF or ZIP archives up to 25MB');
      expect(html).toContain('Click to upload or drag and drop');
    });

    it('renders error alert when error message is supplied', () => {
      const html = renderToStaticMarkup(
        <FileUpload
          label="Upload Document"
          error="File exceeds 10MB limit"
        />,
      );

      expect(html).toContain('File exceeds 10MB limit');
    });

    it('renders custom children trigger when provided', () => {
      const html = renderToStaticMarkup(
        <FileUpload label="Custom Button Upload">
          <button type="button">Upload Custom File</button>
        </FileUpload>,
      );

      expect(html).toContain('Upload Custom File');
    });
  });

  describe('ImageUpload', () => {
    it('renders empty dropzone when value is empty', () => {
      const html = renderToStaticMarkup(
        <ImageUpload
          value=""
          onChange={vi.fn()}
          label="Cover Image"
          description="Upload JPEG, PNG or WebP image"
        />,
      );

      expect(html).toContain('Cover Image');
      expect(html).toContain('Upload JPEG, PNG or WebP image');
    });

    it('renders preview image, URL snippet, and action controls when value is present', () => {
      const html = renderToStaticMarkup(
        <ImageUpload
          value="https://images.unsplash.com/photo-test.jpg"
          onChange={vi.fn()}
          label="Article Banner"
        />,
      );

      expect(html).toContain('Article Banner');
      expect(html).toContain('src="https://images.unsplash.com/photo-test.jpg"');
      expect(html).toContain('Replace');
      expect(html).toContain('Remove');
      expect(html).toContain('Clear');
    });

    it('renders "Choose from Media Library" action button when callback is provided', () => {
      const html = renderToStaticMarkup(
        <ImageUpload
          value=""
          onChange={vi.fn()}
          label="Hero Image"
          onBrowseLibrary={vi.fn()}
        />,
      );

      expect(html).toContain('Choose from Media Library');
    });
  });

  describe('DocumentUpload', () => {
    it('renders empty dropzone when document URL is empty', () => {
      const html = renderToStaticMarkup(
        <DocumentUpload
          value=""
          onChange={vi.fn()}
          label="Candidate CV"
          description="PDF or DOCX document"
        />,
      );

      expect(html).toContain('Candidate CV');
      expect(html).toContain('PDF or DOCX document');
    });

    it('renders document card with filename, size, and actions when document is uploaded', () => {
      const html = renderToStaticMarkup(
        <DocumentUpload
          value="https://storage.veyroo.tech/resumes/ada-lovelace-cv.pdf"
          fileName="ada-lovelace-cv.pdf"
          fileSize={1048576}
          onChange={vi.fn()}
          label="Resume Attached"
        />,
      );

      expect(html).toContain('Resume Attached');
      expect(html).toContain('ada-lovelace-cv.pdf');
      expect(html).toContain('1.0 MB');
      expect(html).toContain('View Document');
      expect(html).toContain('Replace');
      expect(html).toContain('Remove');
    });
  });
});

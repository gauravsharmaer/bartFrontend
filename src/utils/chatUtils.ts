import DOMPurify from "dompurify";

const createMarkup = (htmlContent: string) => {
  // Configure DOMPurify
  DOMPurify.setConfig({
    ADD_ATTR: ["target", "rel"], // Allow target and rel attributes
    ALLOWED_TAGS: ["p", "a", "b", "br", "strong", "em", "span"], // Specify allowed tags
    ALLOWED_ATTR: ["href", "target", "rel", "class"], // Specify allowed attributes
  });

  // Process the HTML content to add rel="noopener noreferrer" to all links
  const doc = new DOMParser().parseFromString(htmlContent, "text/html");
  doc.querySelectorAll('a[target="_blank"]').forEach((link) => {
    link.setAttribute("rel", "noopener noreferrer");
  });

  // Get the processed HTML and sanitize it
  const processedHtml = doc.body.innerHTML;
  return {
    __html: DOMPurify.sanitize(processedHtml),
  };
};

export default createMarkup;

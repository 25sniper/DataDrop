import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Content } from "@shared/schema";

interface ContentItemProps {
  content: Content;
  isCreator: boolean;
  onDelete?: () => void;
}

export function ContentItem({ content, isCreator, onDelete }: ContentItemProps) {
  const { toast } = useToast();

  const getIcon = () => {
    switch (content.type) {
      case "text":
        return "fas fa-sticky-note text-primary";
      case "link":
        return "fas fa-link text-primary";
      case "file":
        if (content.mimeType?.startsWith("image/")) {
          return "fas fa-image text-success";
        } else if (content.mimeType === "application/pdf") {
          return "fas fa-file-pdf text-danger";
        }
        return "fas fa-file text-secondary";
      default:
        return "fas fa-file text-secondary";
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content.data);
    toast({ title: "Copied to clipboard" });
  };

  const handleDownload = () => {
    if (content.type === "file") {
      window.open(`/api/files/${content.data}`, '_blank');
    }
  };

  const renderContent = () => {
    switch (content.type) {
      case "text":
        return <p className="text-gray-900">{content.data}</p>;
      
      case "link":
        return (
          <a 
            href={content.data} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline break-all"
          >
            {content.data}
          </a>
        );
      
      case "file":
        if (content.mimeType?.startsWith("image/")) {
          return (
            <div>
              <img 
                src={`/api/files/${content.data}`}
                alt={content.fileName || "Uploaded image"}
                className="rounded-lg max-w-full h-auto mb-2 max-h-64 object-contain"
              />
              <p className="text-sm text-gray-600">
                {content.fileName} • {formatFileSize(content.fileSize)}
              </p>
            </div>
          );
        } else {
          return (
            <div>
              <p className="text-gray-900 font-medium">{content.fileName}</p>
              <p className="text-sm text-gray-600">{formatFileSize(content.fileSize)}</p>
            </div>
          );
        }
      
      default:
        return <p className="text-gray-900">{content.data}</p>;
    }
  };

  const formatFileSize = (bytes: number | null | undefined): string => {
    if (!bytes) return "Unknown size";
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <i className={`${getIcon()} mr-2`}></i>
            <span className="text-sm font-medium text-gray-700">{content.title}</span>
            <span className="ml-2 text-xs text-gray-500">
              {formatDistanceToNow(new Date(content.createdAt), { addSuffix: true })}
            </span>
          </div>
          {renderContent()}
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          {content.type === "text" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="text-gray-400 hover:text-gray-600"
            >
              <i className="fas fa-copy"></i>
            </Button>
          )}
          
          {content.type === "link" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(content.data, '_blank')}
              className="text-gray-400 hover:text-gray-600"
            >
              <i className="fas fa-external-link-alt"></i>
            </Button>
          )}
          
          {content.type === "file" && (
            <>
              {content.mimeType?.startsWith("image/") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(`/api/files/${content.data}`, '_blank')}
                  className="text-primary hover:text-primary-dark"
                >
                  <i className="fas fa-expand"></i>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                className="text-primary hover:text-primary-dark"
              >
                <i className="fas fa-download"></i>
              </Button>
            </>
          )}
          
          {isCreator && onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-gray-400 hover:text-red-600"
            >
              <i className="fas fa-trash"></i>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

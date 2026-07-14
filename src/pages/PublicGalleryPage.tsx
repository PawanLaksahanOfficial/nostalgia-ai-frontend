import React, { useState, useEffect } from "react";
import { useComponentStyle } from "../hooks/useComponentStyle";
import { getPublicMemories, getSharedMemory } from "../services/homeServices";

export const PublicGalleryPage: React.FC = () => {
  const Styles = useComponentStyle("gallery");
  const [memories, setMemories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMemory, setSelectedMemory] = useState<any>(null);

  useEffect(() => {
    loadPublicMemories();
  }, []);

  const loadPublicMemories = async () => {
    try {
      const data = await getPublicMemories();
      setMemories(data);
    } catch (error) {
      console.error("Failed to load public memories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMemoryClick = async (shareToken: string) => {
    try {
      const memory = await getSharedMemory(shareToken);
      setSelectedMemory(memory);
    } catch (error) {
      console.error("Failed to load shared memory:", error);
    }
  };

  const handleClose = () => {
    setSelectedMemory(null);
  };

  if (loading) {
    return <div style={Styles.loading}>Loading gallery...</div>;
  }

  return (
    <div style={Styles.wrapper}>
      <main style={Styles.content}>
        <div style={Styles.header}>
          <h1 style={Styles.title}>Public Gallery</h1>
          <p style={Styles.subtitle}>Discover nostalgic memories shared by our community</p>
        </div>

        {memories.length === 0 ? (
          <div style={Styles.emptyState}>
            <p>No public memories yet. Be the first to share!</p>
          </div>
        ) : (
          <div style={Styles.grid}>
            {memories.map((memory) => (
              <div 
                key={memory.id} 
                style={Styles.card}
                onClick={() => handleMemoryClick(memory.shareToken || memory.id.toString())}
              >
                {memory.thumbnailPath ? (
                  <img 
                    src={`/storage/${memory.thumbnailPath}`} 
                    alt={memory.title}
                    style={Styles.thumbnail}
                  />
                ) : (
                  <div style={Styles.placeholder}>
                    <span style={Styles.placeholderIcon}>🎬</span>
                  </div>
                )}
                <div style={Styles.cardContent}>
                  <h3 style={Styles.cardTitle}>{memory.title}</h3>
                  <p style={Styles.cardMeta}>
                    By {memory.authorName} • {new Date(memory.createdAt).toLocaleDateString()}
                  </p>
                  <div style={Styles.cardFooter}>
                    <span style={Styles.views}>👁 {memory.viewCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedMemory && (
          <div style={Styles.modal} onClick={handleClose}>
            <div style={Styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <button style={Styles.closeButton} onClick={handleClose}>✕</button>
              <h2 style={Styles.modalTitle}>{selectedMemory.title}</h2>
              <p style={Styles.modalAuthor}>By {selectedMemory.authorName}</p>
              {selectedMemory.thumbnailPath && (
                <img 
                  src={`/storage/${selectedMemory.thumbnailPath}`} 
                  alt={selectedMemory.title}
                  style={Styles.modalImage}
                />
              )}
              <p style={Styles.modalStory}>{selectedMemory.storyText}</p>
              {selectedMemory.finalVideoPath && (
                <video 
                  src={`/storage/${selectedMemory.finalVideoPath}`} 
                  controls 
                  style={Styles.videoPlayer}
                />
              )}
              <p style={Styles.modalMeta}>
                {new Date(selectedMemory.createdAt).toLocaleDateString()} • {selectedMemory.viewCount} views
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
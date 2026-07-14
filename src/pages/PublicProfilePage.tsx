import React, { useState, useEffect } from "react";
import { useComponentStyle } from "../hooks/useComponentStyle";
import { getPublicMemories, getSharedMemory } from "../services/homeServices";
import { useParams } from "react-router-dom";

export const PublicProfilePage: React.FC = () => {
  const Styles = useComponentStyle("gallery");
  const { userId } = useParams<{ userId: string }>();
  const [memories, setMemories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMemory, setSelectedMemory] = useState<any>(null);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    loadUserMemories();
  }, [userId]);

  const loadUserMemories = async () => {
    try {
      const allMemories = await getPublicMemories();
      const userMemories = allMemories.filter((m: any) => m.userId === parseInt(userId || "0"));
      setMemories(userMemories);
      if (userMemories.length > 0) {
        setUserName(userMemories[0].authorName);
      }
    } catch (error) {
      console.error("Failed to load user memories:", error);
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
    return <div style={Styles.loading}>Loading profile...</div>;
  }

  return (
    <div style={Styles.wrapper}>
      <main style={Styles.content}>
        <div style={Styles.header}>
          <h1 style={Styles.title}>{userName}'s Memories</h1>
          <p style={Styles.subtitle}>
            {memories.length} {memories.length === 1 ? 'memory' : 'memories'} shared publicly
          </p>
        </div>
        {memories.length === 0 ? (
          <div style={Styles.emptyState}>
            <p>No public memories to display.</p>
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
                    {new Date(memory.createdAt).toLocaleDateString()}
                  </p>
                  <div style={Styles.cardFooter}>
                    <span style={Styles.views}>👁 {memory.viewCount}</span>
                    <span style={Styles.views}>❤️ {memory.likeCount || 0}</span>
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
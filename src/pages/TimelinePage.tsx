import React, { useState, useEffect } from "react";
import { useComponentStyle } from "../hooks/useComponentStyle";
import { getMyMemories } from "../services/homeServices";
import { useNavigate } from "react-router-dom";

export const TimelinePage: React.FC = () => {
  const Styles = useComponentStyle("timeline");
  const navigate = useNavigate();
  const [memories, setMemories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    try {
      const data = await getMyMemories();
      setMemories(data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error("Failed to load memories:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood?.toLowerCase()) {
      case 'joyful':
      case 'happy':
        return '😊';
      case 'bittersweet':
      case 'nostalgic':
        return '🥺';
      case 'melancholic':
      case 'sad':
        return '😢';
      case 'exciting':
      case 'adventure':
        return '🎉';
      case 'peaceful':
      case 'calm':
        return '😌';
      default:
        return '💭';
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood?.toLowerCase()) {
      case 'joyful':
      case 'happy':
        return '#10b981';
      case 'bittersweet':
      case 'nostalgic':
        return '#f59e0b';
      case 'melancholic':
      case 'sad':
        return '#6b7280';
      case 'exciting':
      case 'adventure':
        return '#ef4444';
      case 'peaceful':
      case 'calm':
        return '#3b82f6';
      default:
        return '#8b5cf6';
    }
  };

  const groupMemoriesByMonth = (memories: any[]) => {
    const groups: { [key: string]: any[] } = {};
    memories.forEach(memory => {
      const date = new Date(memory.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(memory);
    });
    return groups;
  };

  const filteredMemories = selectedMood 
    ? memories.filter(m => m.musicMood?.toLowerCase() === selectedMood.toLowerCase())
    : memories;

  const groupedMemories = groupMemoriesByMonth(filteredMemories);
  const uniqueMoods = Array.from(new Set(memories.map(m => m.musicMood).filter(Boolean)));

  const formatMonthYear = (key: string) => {
    const [year, month] = key.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  if (loading) {
    return <div style={Styles.loading}>Loading timeline...</div>;
  }

  return (
    <div style={Styles.wrapper}>
      <main style={Styles.content}>
        <div style={Styles.card}>
          <div style={Styles.header}>
            <div>
              <h1 style={Styles.title}>Memory Timeline</h1>
              <p style={Styles.subtitle}>
                {memories.length} {memories.length === 1 ? 'memory' : 'memories'} total
              </p>
            </div>
            <button 
              style={Styles.backButton}
              onClick={() => navigate('/profile')}
            >
              Back to Profile
            </button>
          </div>
          {uniqueMoods.length > 0 && (
            <div style={Styles.filterSection}>
              <h3 style={Styles.filterTitle}>Filter by Mood</h3>
              <div style={Styles.filterButtons}>
                <button
                  style={selectedMood === null ? Styles.filterButtonActive : Styles.filterButton}
                  onClick={() => setSelectedMood(null)}
                >
                  All
                </button>
                {uniqueMoods.map((mood) => (
                  <button
                    key={mood}
                    style={{
                      ...(selectedMood === mood ? Styles.filterButtonActive : Styles.filterButton),
                      borderColor: getMoodColor(mood),
                      backgroundColor: selectedMood === mood ? getMoodColor(mood) : 'transparent',
                    }}
                    onClick={() => setSelectedMood(mood)}
                  >
                    {getMoodEmoji(mood)} {mood}
                  </button>
                ))}
              </div>
            </div>
          )}
          {filteredMemories.length === 0 ? (
            <div style={Styles.emptyState}>
              <p>No memories found. Start creating nostalgic memories!</p>
            </div>
          ) : (
            <div style={Styles.timelineContainer}>
              <div style={Styles.timelineLine} />

              {Object.entries(groupedMemories).map(([monthKey, monthMemories]) => (
                <div key={monthKey} style={Styles.monthGroup}>
                  <div style={Styles.monthHeader}>
                    <div style={Styles.monthDot} />
                    <h3 style={Styles.monthTitle}>
                      {formatMonthYear(monthKey)}
                    </h3>
                  </div>

                  <div style={Styles.memoryList}>
                    {monthMemories.map((memory) => (
                      <div
                        key={memory.id}
                        style={Styles.memoryCard}
                        onClick={() => navigate(`/profile`)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateX(4px)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateX(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div style={Styles.memoryHeader}>
                          <span style={Styles.moodEmoji}>
                            {getMoodEmoji(memory.musicMood || '')}
                          </span>
                          <div style={Styles.memoryInfo}>
                            <h4 style={Styles.memoryTitle}>
                              {memory.title}
                            </h4>
                            <p style={Styles.memoryDate}>
                              {new Date(memory.createdAt).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <span style={{
                            ...Styles.statusBadge,
                            backgroundColor: memory.status === 'Completed' ? '#10b981' : memory.status === 'Processing' ? '#f59e0b' : '#6b7280',
                          }}>
                            {memory.status}
                          </span>
                        </div>
                        {memory.thumbnailPath && (
                          <img
                            src={`/storage/${memory.thumbnailPath}`}
                            alt={memory.title}
                            style={Styles.memoryThumbnail}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
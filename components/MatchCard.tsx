import React, { useState } from "react";
import { useRouter } from "next/router";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { Match, getOrganizer, getFieldData, likeMatch } from "@/lib/matchApi";
import { useAuth } from "@/contexts/AuthContext";
import { getSkillLevelLabel, getSkillLevelColor } from "@/lib/skillLevels";
import styles from "./MatchCard.module.css";

interface MatchCardProps {
    match: Match;
    onLikeToggle?: (matchId: string, newLikes: number) => void;
}

export default function MatchCard({ match, onLikeToggle }: MatchCardProps) {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(match.likes || 0);
    const [liking, setLiking] = useState(false);

    const field = getFieldData(match);

    const spotsLeft = match.maxPlayers - match.currentPlayers;
    const fillPct = match.maxPlayers > 0 ? (match.currentPlayers / match.maxPlayers) * 100 : 0;
    const isAlmostFull = spotsLeft > 0 && spotsLeft <= 3;
    const isFull = spotsLeft <= 0;

    const half = Math.ceil(match.maxPlayers / 2);
    const teamSize = match.maxPlayers > 0 ? `${half}v${half}` : null;

    const genderLabel =
        match.gender === "MALE" ? "Men"
            : match.gender === "FEMALE" ? "Women"
                : match.gender === "MIXED" ? "Mixed"
                    : null;

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isAuthenticated) { router.push("/login"); return; }
        if (liking) return;
        setLiking(true);
        try {
            const updated = await likeMatch(match._id);
            const newLikes = updated.likes ?? likeCount;
            setLikeCount(newLikes);
            setLiked((p) => !p);
            onLikeToggle?.(match._id, newLikes);
        } catch { /* silent */ } finally { setLiking(false); }
    };

    return (
        <div className={styles.card} onClick={() => router.push(`/match/${match._id}`)}>

            {/* ── LEFT: time + status ── */}
            <div className={styles.timeCol}>
                <span className={styles.time}>{match.matchTime || "--:--"}</span>
                {isFull && <span className={`${styles.badge} ${styles.badgeFull}`}>Full</span>}
                {isAlmostFull && <span className={`${styles.badge} ${styles.badgeClosing}`}>Closing</span>}
                {!isFull && !isAlmostFull && <span className={`${styles.badge} ${styles.badgeOpen}`}>Open</span>}
            </div>

            {/* ── CENTER: info ── */}
            <div className={styles.infoCol}>
                <p className={styles.title}>{match.matchTitle}</p>
                <p className={styles.venue}>
                    {field?.propertyName || match.location?.address || "Venue TBD"}
                </p>

                {/* Tags row */}
                <div className={styles.tags}>
                    {genderLabel && <span className={styles.tag}>{genderLabel}</span>}
                    {teamSize && <span className={styles.tag}>{teamSize}</span>}
                    {match.skillLevel && (
                        <span
                            className={styles.tag}
                            style={{ color: getSkillLevelColor(match.skillLevel), borderColor: getSkillLevelColor(match.skillLevel) }}
                        >
                            {getSkillLevelLabel(match.skillLevel)}
                        </span>
                    )}
                    {match.matchType === "TOURNAMENT" && <span className={styles.tag}>Tournament</span>}
                    {match.matchType === "FRIENDLY" && <span className={styles.tag}>Friendly</span>}
                </div>

                {/* Progress */}
                <div className={styles.progressBar}>
                    <div
                        className={styles.progressFill}
                        style={{
                            width: `${Math.min(100, fillPct)}%`,
                            background: isFull ? "#ef4444" : isAlmostFull ? "#f97316" : "#00E377",
                        }}
                    />
                </div>
                <div className={styles.spots}>
                    <PeopleAltIcon sx={{ fontSize: 13 }} />
                    <span>{match.currentPlayers}/{match.maxPlayers} players</span>
                    {!isFull && (
                        <span className={isAlmostFull ? styles.spotsWarning : styles.spotsNeutral}>
                            · {spotsLeft} left
                        </span>
                    )}
                </div>
            </div>

            {/* ── RIGHT: price + like ── */}
            <div className={styles.rightCol}>
                {(match.matchFee ?? 0) > 0
                    ? <span className={styles.price}>₩{(match.matchFee ?? 0).toLocaleString()}</span>
                    : <span className={styles.free}>Free</span>
                }
                <button
                    className={`${styles.likeBtn}${liked ? " " + styles.liked : ""}`}
                    onClick={handleLike}
                    disabled={liking}
                    aria-label="Like"
                >
                    {liked
                        ? <FavoriteIcon sx={{ fontSize: 17 }} />
                        : <FavoriteBorderIcon sx={{ fontSize: 17 }} />
                    }
                    <span>{likeCount}</span>
                </button>
            </div>

        </div>
    );
}

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Heart, Star, ArrowRight, User, Hash, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Link, useNavigate } from 'react-router-dom';

// --- [Mock Data] 메인 배너 데이터 ---
const banners = [
    {
        id: 1,
        title: "이번 주말, 어디로 떠날까?",
        subtitle: "TripPlanner가 추천하는 이번 주 베스트 여행지",
        bgColor: "#78C2AD",
        btnColor: "#4a9c85"
    },
    {
        id: 2,
        title: "친구들과 함께하는 우정여행",
        subtitle: "일정 투표부터 장소 선정까지 한 번에 해결하세요.",
        bgColor: "#6CC3D5",
        btnColor: "#4aa3b5"
    },
    {
        id: 3,
        title: "나만의 숨은 명소 공유",
        subtitle: "당신만 알고 있는 핫플레이스를 일정에 담아 공유해보세요.",
        bgColor: "#F3969A",
        btnColor: "#d67579"
    }
];

export default function Home() {
    const navigate = useNavigate();
    const MINT_COLOR = "#78C2AD";
    const scrollRef = useRef(null);

    // State
    const [schedules, setSchedules] = useState([]);
    const [tagList, setTagList] = useState([]);
    const [selectedTag, setSelectedTag] = useState("전체");
    const [currentBanner, setCurrentBanner] = useState(0);

    // 데이터 로드
    useEffect(() => {
        loadData();
    }, []);

    // 자동 배너 슬라이드
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const loadData = async () => {
        try {
            const scheduleResp = await axios.get("/api/schedule");
            setSchedules(scheduleResp.data);

            const tagResp = await axios.get("/api/schedule/tagList");
            setTagList(tagResp.data);
        } catch (e) {
            console.error("데이터 로드 실패", e);
        }
    };

    const filteredSchedules = selectedTag === "전체"
        ? schedules
        : schedules.filter(item => item.tags && item.tags.includes(selectedTag));

    const getDurationText = (start, end) => {
        if (!start || !end) return "";
        const s = dayjs(start);
        const e = dayjs(end);
        const nights = e.diff(s, 'day');
        const days = nights + 1;
        if (nights === 0) return `당일치기`;
        return `${nights}박 ${days}일`;
    };

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    // Custom Styles (Z-Index 최적화)
    const styles = {
        wrapper: {
            position: "relative",
            zIndex: 0, // [핵심] 전체 컨텐츠 레이어를 낮춰서 고객센터 버튼(보통 z-index 높음)이 위로 오게 함
        },
        sectionTitle: {
            fontWeight: "800",
            color: "#333",
            marginBottom: "0.5rem",
            display: "flex",
            alignItems: "center",
            gap: "8px"
        },
        sectionDesc: {
            color: "#888",
            marginBottom: "2rem",
            fontSize: "0.95rem"
        },
        card: {
            border: "none",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            backgroundColor: "white",
            height: "100%",
            minWidth: "300px", // 카드 최소 너비
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            zIndex: 1 // 카드 내부 요소끼리의 정렬을 위해 1 정도만 부여
        },
        cardImage: {
            height: "200px",
            width: "100%",
            objectFit: "cover",
        },
        cardBody: {
            padding: "1.2rem",
            flex: 1,
            display: "flex",
            flexDirection: "column"
        },
        tag: {
            fontSize: "0.75rem",
            color: MINT_COLOR,
            backgroundColor: "#effbf8",
            padding: "4px 8px",
            borderRadius: "6px",
            fontWeight: "600",
            marginRight: "6px",
            display: "inline-block",
            marginBottom: "6px"
        },
        bannerContainer: {
            height: "360px",
            borderRadius: "20px",
            position: "relative",
            overflow: "hidden",
            width: "100%",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            zIndex: 0 // 배너 컨테이너도 낮게 설정
        },
        bannerSlide: {
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 4rem",
            color: "white",
            transition: "all 0.5s ease-in-out",
        },
        userImage: {
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            backgroundColor: "#eee",
            marginRight: "6px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "10px",
            color: "#888"
        },
        scrollContainer: {
            display: "flex",
            gap: "24px",
            overflowX: "auto",
            paddingBottom: "20px",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            zIndex: 1
        }
    };

    return (
        <div className="content-wrapper container py-4" style={styles.wrapper}>
            <style>
                {`
                    .scroll-container::-webkit-scrollbar {
                        display: none;
                    }
                    /* 배너 인디케이터 */
                    .banner-dot {
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        background: rgba(255,255,255,0.4);
                        margin: 0 4px;
                        cursor: pointer;
                        transition: all 0.3s;
                        position: relative;
                        z-index: 5; /* 배너 이미지보다만 위에 있으면 됨 (1000 X) */
                    }
                    .banner-dot.active {
                        width: 24px;
                        border-radius: 4px;
                        background: white;
                    }
                    /* 좌우 네비게이션 버튼 */
                    .nav-btn {
                        position: absolute;
                        top: 50%;
                        transform: translateY(-50%);
                        background: white;
                        border: none;
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                        z-index: 5; /* 너무 높지 않게 설정 */
                        cursor: pointer;
                        color: ${MINT_COLOR};
                    }
                `}
            </style>

            {/* 1. 메인 배너 섹션 */}
            <section className="mb-5" style={{ position: 'relative', zIndex: 0 }}>
                <div style={styles.bannerContainer}>
                    {banners.map((banner, idx) => (
                        <div
                            key={banner.id}
                            style={{
                                ...styles.bannerSlide,
                                backgroundColor: banner.bgColor,
                                position: idx === currentBanner ? "relative" : "absolute",
                                opacity: idx === currentBanner ? 1 : 0,
                                top: 0,
                                left: 0,
                                pointerEvents: idx === currentBanner ? "auto" : "none",
                                zIndex: 1 // 배너 내용물은 낮게
                            }}
                        >
                            {/* 배경 장식 (z-index 음수) */}
                            <div style={{ position: 'absolute', right: '-50px', top: '-50px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', zIndex: -1 }} />
                            <div style={{ position: 'absolute', right: '100px', bottom: '-100px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', zIndex: -1 }} />

                            <h1 className="display-5 fw-bold mb-3" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.1)", zIndex: 1 }}>
                                {banner.title}
                            </h1>
                            <p className="lead mb-4" style={{ opacity: 0.9, zIndex: 1 }}>
                                {banner.subtitle}
                            </p>
                            <button className="btn text-white px-4 py-2 rounded-pill fw-bold shadow-sm"
                                onClick={() => navigate('/schedule/list')}
                                style={{ backgroundColor: banner.btnColor, width: "fit-content", border: "none", zIndex: 2 }}>
                                자세히 보기 <ArrowRight size={18} className="ms-1" />
                            </button>
                        </div>
                    ))}

                    <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', zIndex: 5 }}>
                        {banners.map((_, idx) => (
                            <div
                                key={idx}
                                className={`banner-dot ${idx === currentBanner ? 'active' : ''}`}
                                onClick={() => setCurrentBanner(idx)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* 2. 추천 일정 섹션 */}
            <section className="py-4" style={{ position: 'relative', zIndex: 0 }}>
                <div className="d-flex justify-content-between align-items-end mb-4">
                    <div>
                        <h3 style={styles.sectionTitle}>
                            <Star fill="#FFD700" color="#FFD700" size={24} />
                            TripPlanner 추천 일정
                        </h3>
                        <p style={styles.sectionDesc}>
                            {selectedTag === "전체"
                                ? "고민은 덜고 즐거움은 더하는 인기 코스를 만나보세요."
                                : `#${selectedTag} 테마로 떠나는 여행 코스입니다.`}
                        </p>
                    </div>
                    <Link to="/scheduleList" style={{ color: "#888", textDecoration: "none", fontSize: "0.9rem", fontWeight: "500" }}>
                        전체보기 &gt;
                    </Link>
                </div>

                <div style={{ position: 'relative' }}>
                    {filteredSchedules.length > 3 && (
                        <>
                            <button onClick={() => scroll('left')} className="nav-btn" style={{ left: '-20px' }}><ChevronLeft /></button>
                            <button onClick={() => scroll('right')} className="nav-btn" style={{ right: '-20px' }}><ChevronRight /></button>
                        </>
                    )}

                    <div ref={scrollRef} className="scroll-container" style={styles.scrollContainer}>
                        {filteredSchedules.length > 0 ? (
                            filteredSchedules.map((item) => (
                                <div key={item.scheduleNo} style={{ minWidth: 'calc(33.333% - 16px)', flexShrink: 0 }}>
                                    <Link to={`/schedulePage/${item.scheduleNo}`} className="text-decoration-none text-dark">
                                        <div
                                            style={styles.card}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = "translateY(-5px)";
                                                e.currentTarget.style.boxShadow = "0 10px 20px rgba(120, 194, 173, 0.2)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = "translateY(0)";
                                                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.05)";
                                            }}
                                        >
                                            <div style={{ position: "relative" }}>

                                                <img
                                                    src={
                                                        item.scheduleImage
                                                            ? `/api/attachment/download/${item.scheduleImage}`
                                                            : "/images/default-schedule.png"
                                                    }
                                                    onError={(e) => e.target.src = "/images/default-schedule.png"}
                                                    alt={item.scheduleName}
                                                    style={styles.cardImage}
                                                />
                                                <div style={{
                                                    position: "absolute", top: "10px", right: "10px",
                                                    backgroundColor: "rgba(255,255,255,0.9)", borderRadius: "20px",
                                                    padding: "4px 8px", fontSize: "0.8rem", fontWeight: "bold",
                                                    color: "#ff6b6b", display: "flex", alignItems: "center", gap: "4px",
                                                    zIndex: 2
                                                }}>
                                                    <Heart size={12} fill="#ff6b6b" /> {item.likeCount || 0}
                                                </div>
                                            </div>

                                            <div style={styles.cardBody}>
                                                <div className="mb-2">
                                                    {item.unitFirst && <span style={styles.tag}>{item.unitFirst}</span>}
                                                    {item.tags && item.tags.split(',').slice(0, 2).map((tag, idx) => (
                                                        <span key={idx} style={{ ...styles.tag, backgroundColor: "#f1f3f5", color: "#666" }}>#{tag}</span>
                                                    ))}
                                                </div>

                                                <h5 className="fw-bold mb-2 text-truncate" style={{ fontSize: '1.1rem' }}>{item.scheduleName}</h5>

                                                <div className="d-flex align-items-center mb-3">
                                                    <div style={styles.userImage}><User size={12} /></div>
                                                    <span className="text-muted small">{item.scheduleOwner}</span>
                                                </div>

                                                <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-auto">
                                                    <div className="d-flex align-items-center text-muted small">
                                                        <MapPin size={14} className="me-1" />
                                                        {getDurationText(item.scheduleStartDate, item.scheduleEndDate)}
                                                    </div>
                                                    <div className="d-flex align-items-center text-muted small">
                                                        <User size={14} className="me-1" /> {item.memberCount}명
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="w-100 text-center py-5 text-muted bg-light rounded-4">
                                <p className="mb-0">해당 테마의 추천 일정이 아직 없습니다 😅</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* 3. 키워드 섹션 (태그 필터) */}
            <section className="py-5" style={{ position: 'relative', zIndex: 0 }}>
                <h3 style={styles.sectionTitle}>
                    <Hash color={MINT_COLOR} size={24} className="me-2" />
                    어떤 약속이 있으신가요?
                </h3>
                <p style={styles.sectionDesc}>상황에 딱 맞는 태그를 선택해보세요.</p>

                <div className="d-flex flex-wrap gap-2">
                    <button
                        className={`btn rounded-pill px-4 py-2 fw-bold shadow-sm ${selectedTag === '전체' ? 'text-white' : 'btn-outline-light text-dark'}`}
                        style={{
                            backgroundColor: selectedTag === '전체' ? MINT_COLOR : 'white',
                            borderColor: selectedTag === '전체' ? MINT_COLOR : '#eee',
                            transition: "all 0.2s"
                        }}
                        onClick={() => setSelectedTag("전체")}
                    >
                        전체
                    </button>

                    {tagList.map((tag) => (
                        <button
                            key={tag.tagNo}
                            className={`btn rounded-pill px-4 py-2 fw-bold shadow-sm ${selectedTag === tag.tagName ? 'text-white' : 'btn-outline-light text-dark'}`}
                            style={{
                                backgroundColor: selectedTag === tag.tagName ? MINT_COLOR : 'white',
                                borderColor: selectedTag === tag.tagName ? MINT_COLOR : '#eee',
                                transition: "all 0.2s"
                            }}
                            onClick={() => setSelectedTag(tag.tagName)}
                        >
                            #{tag.tagName}
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
}
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import 'dayjs/locale/ko';
import { useAtomValue } from "jotai";
import { accessTokenState, loginIdState, loginState } from "../../utils/jotai";

const MINT_COLOR = "#78C2AD";

export default function ScheduleModal({ isOpen, onClose }) {
    //jotai state
    const loginId = useAtomValue(loginIdState);
    const isLogin = useAtomValue(loginState);
    const accessToken = useAtomValue(accessTokenState);


    const [scheduleName, setScheduleName] = useState("");
    const [startDate, setStartDate] = useState(dayjs().format("YYYY-MM-DDTHH:mm"));
    const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DDTHH:mm"));
    const [checked, setChecked] = useState(false);
    
    const [tags, setTags] = useState([]);
    const [selectTag, setSelectTag] = useState([]); // 태그 '이름'들을 담습니다.

    useEffect(() => {
        if (isOpen) {
            setScheduleName("");
            setStartDate(dayjs().format("YYYY-MM-DDTHH:mm"));
            setEndDate(dayjs().format("YYYY-MM-DDTHH:mm"));
            setChecked(false);
            setSelectTag([]);
            loadTags();
        }
    }, [isOpen]);

    const loadTags = async () => {
        try {
            const { data } = await axios.get("http://localhost:8080/schedule/tagList");
            setTags(data);
        } catch (e) {
            console.error("태그 로드 실패", e);
        }
    };

    // [수정] 태그 선택 핸들러: '번호'가 아니라 '이름(tagName)'을 저장합니다.
    const tagCheck = useCallback((tagName) => {
        setSelectTag(prev => 
            prev.includes(tagName) ? prev.filter(t => t !== tagName) : [...prev, tagName]
        );
    }, []);

    const categories = Array.from(new Set(tags.map(t => t.tagCategory)));

    const sendData = useCallback(async () => {
        // 로그인 상태가 아니라면 차단
        if(!isLogin || !loginId){
            alert("로그인 정보가 유효하지 않습니다");
            onclose();
            return;
        }

        if (!scheduleName) return alert("일정 제목을 입력해주세요.");

        const data = {
            scheduleName: scheduleName,
            scheduleOwner: loginId,
            scheduleStartDate: dayjs(startDate).format("YYYY-MM-DDTHH:mm:ss"), // 백엔드 필드명 일치
            scheduleEndDate: checked ? dayjs(endDate).format("YYYY-MM-DDTHH:mm:ss") : dayjs(startDate).format("YYYY-MM-DDTHH:mm:ss"),
            
            // [확인] 백엔드 VO는 tagNoList라고 되어있지만, 실제로는 List<String> 타입으로 이름을 받습니다.
            tagNoList: selectTag 
        };

        try {
            await axios.post("http://localhost:8080/schedule/insert", data);
            
            alert(`[${data.scheduleName}] 일정이 등록되었습니다!`);
            onClose(); 
        } catch (error) {
            console.error("등록 에러:", error);
            alert("일정 등록이 실패되었습니다.");
        }
    }, [scheduleName, startDate, endDate, checked, selectTag, onClose, isLogin, loginId]);

    if (!isOpen) return null;

    return (
        <>
            <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
            <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1055 }}>
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content border-0 shadow-lg rounded-4">
                        
                        <div className="modal-header border-0 bg-light rounded-top-4">
                            <h5 className="modal-title fw-bold">🗓️ 일정 등록하기</h5>
                            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                        </div>

                        <div className="modal-body p-4">
                            <div className="mb-4">
                                <label className="form-label fw-bold small text-muted">일정 제목</label>
                                <input
                                    type="text" className="form-control form-control-lg fw-bold bg-light border-0"
                                    style={{ height: "57px" }}
                                    value={scheduleName} onChange={(e) => setScheduleName(e.target.value)}
                                    placeholder="예: 3박 4일 부산 여행"
                                />
                            </div>

                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <label className="form-label fw-bold small text-muted">시작일</label>
                                    <input 
                                        type="datetime-local" className="form-control"
                                        value={startDate} onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <div className="d-flex justify-content-between mb-2">
                                        <label className="form-label fw-bold small text-muted m-0">종료일</label>
                                        <div className="form-check form-switch m-0">
                                            <input 
                                                className="form-check-input" type="checkbox" id="checkEnd"
                                                checked={checked} onChange={(e) => setChecked(e.target.checked)} 
                                                style={{cursor:"pointer"}}
                                            />
                                            <label className="form-check-label small" htmlFor="checkEnd" style={{cursor:"pointer"}}>설정</label>
                                        </div>
                                    </div>
                                    <input 
                                        type="datetime-local" className="form-control"
                                        value={endDate} onChange={(e) => setEndDate(e.target.value)}
                                        min={startDate}
                                        disabled={!checked}
                                        style={{ opacity: checked ? 1 : 0.5 }}
                                    />
                                </div>
                            </div>

                            <hr className="my-4 text-muted opacity-25" />

                            <div>
                                <h5 className="fw-bold mb-3" style={{fontSize:"1.1rem"}}>어떤 스타일의 일정인가요?</h5>
                                {categories.map((category, index) => {
                                    const categoryTags = tags.filter(t => t.tagCategory === category).slice(0, 5);
                                    return (
                                        <div key={index} className="mb-3">
                                            <label className="small text-muted fw-bold mb-2">{category}</label>
                                            <div className="d-flex flex-wrap gap-2">
                                                {categoryTags.map((tag) => (
                                                    <button
                                                        key={tag.tagNo} type="button"
                                                        // [수정] tag.tagName을 넘깁니다.
                                                        onClick={() => tagCheck(tag.tagName)}
                                                        className={`btn btn-sm rounded-pill px-3 fw-bold transition-all ${
                                                            selectTag.includes(tag.tagName) // 이름으로 비교
                                                            ? "text-white shadow-sm" 
                                                            : "btn-outline-secondary border-0 bg-light text-secondary"
                                                        }`}
                                                        style={{
                                                            backgroundColor: selectTag.includes(tag.tagName) ? MINT_COLOR : undefined,
                                                            borderColor: selectTag.includes(tag.tagName) ? MINT_COLOR : undefined,
                                                            transform: selectTag.includes(tag.tagName) ? "scale(1.05)" : "scale(1)",
                                                            transition: "all 0.2s ease"
                                                        }}
                                                    >
                                                        #{tag.tagName}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="modal-footer border-0 pt-0 pb-4 pe-4">
                            <button type="button" className="btn btn-light fw-bold text-secondary px-4 rounded-3" onClick={onClose}>취소</button>
                            <button type="button" className="btn fw-bold text-white px-4 rounded-3 shadow-sm"
                                style={{ backgroundColor: MINT_COLOR }} onClick={sendData}>
                                등록하기
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
import { useCallback, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"
import Modal from 'react-modal';
const TermsModal = () => {
    // 이동도구
    const navigate = useNavigate();

    // ref
    const subtitleRef = useRef(null);

    // state
    const [modalOpen, setModalOpen] = useState(false);
    //체크여부
    const [check, setCheck] = useState({
        all: false,
        service: false,
        privacy: false,
        marketing: false,
    });
    // 다음 버튼 활성화
    const [nextButton, setNextButton] = useState(false);

    // callback
    const openModal = useCallback(() => {
        setModalOpen(true);
        // 모달 열 때 체크상태 초기화
        setCheck({ all: false, service: false, privacy: false, marketing: false })
    }, []);

    const closeModal = useCallback(() => {
        setModalOpen(false);
    }, []);

    // 체크박스 (전체선택, 개별선택)
    const handleCheck = useCallback(e => {
        const { name, checked } = e.target;

        if (name === "all") {//전체항목 체크
            setCheck({
                all: checked,
                service: checked,
                privacy: checked,
                marketing: checked
            });
        }
        else {
            setCheck(prev => {
                const newState = { ...prev, [name]: checked };

                // 모든 개별항목 선택을 하면 전체동의가 활성화, 하나라도 빠지면 전체동의가 비활성화
                const allChecked = newState.service && newState.privacy && newState.marketing;
                return { ...newState, all: allChecked }
            })
        }
    }, [check]);

    // 버튼 활성화 여부
    const isNextEnabled = check.service && check.privacy;

    // 동의하기 버튼을 누르면 회원가입 페이지로 이동
    const moveToAccountJoin = useCallback(() => {
        if (check.privacy && check.service) {
            navigate("/account/join");
        }
    }, [check]);

    return (
        <>
            <Modal
                isOpen={modalOpen}
                onRequestClose={closeModal}
                contentLabel="약관 동의 모달"
                className="modal-dialog modal-lg"
                ariaHideApp={false} // App Element 경고 무시

            >
                <div className="modal-content bg-white rounded-3 pt-5   ">

                    {/* Header: 제목과 닫기 버튼 */}
                    <div className="modal-header d-flex justify-content-center border-0 pb-3 pt-2">
                        <h1 className="modal-title fs-2 fw-bold" ref={subtitleRef}>약관 동의</h1>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={closeModal}
                        ></button>
                    </div>
                    <div className="text-center text-muted mb-4 px-4 md">
                        회원가입을 계속하려면, 이용약관 및 정책에 동의해주세요
                    </div>

                    {/* Body: 약관 리스트 */}
                    <div className="modal-body pt-0 px-4">
                        {/* 전체 동의 섹션 */}
                        <div className="form-check d-flex align-items-center mb-2">
                            <input
                                className="form-check-input" type="checkbox" id="checkAll" name="all"
                                checked={check.all} onChange={handleCheck}
                                style={{ transform: 'scale(1.2)' }}
                            />
                            <label className="form-check-label fw-bold ms-2 fs-5" htmlFor="checkAll">
                                모두 동의합니다
                            </label>
                        </div>

                        <hr className="my-3" />
                        {/* 개별 약관 동의 */}
                        <ul className="list-group list-group-flush">
                            {/* 서비스 이용약관 */}
                            <li className="list-group-item border-0 px-0 py-2 d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <input className="form-check-input" type="checkbox" id="checkService" name="service" checked={check.service} onChange={handleCheck} />
                                    <label className="form-check-label ms-2" htmlFor="checkService">
                                        <span className="text-primary fw-bold">(필수)</span> 서비스 이용약관
                                    </label>
                                </div>
                                <span className="view-link">보기 &gt;</span>
                            </li>

                            {/* 개인정보 */}
                            <li className="list-group-item border-0 px-0 py-2 d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <input className="form-check-input" type="checkbox" id="checkPrivacy" name="privacy" checked={check.privacy} onChange={handleCheck} />
                                    <label className="form-check-label ms-2" htmlFor="checkPrivacy">
                                        <span className="text-primary fw-bold">(필수)</span> 개인정보 수집 및 이용
                                    </label>
                                </div>
                                <span className="view-link">보기 &gt;</span>
                            </li>

                            {/* 마케팅 */}

                            <li className="list-group-item border-0 px-0 py-2 d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <input className="form-check-input" type="checkbox" id="checkMarketing" name="marketing" checked={check.marketing} onChange={handleCheck} />
                                    <label className="form-check-label ms-2" htmlFor="checkMarketing">
                                        <span className="text-secondary fw-bold">(선택)</span> 마케팅 정보 수신 동의
                                    </label>
                                </div>
                                <span className="view-link">보기 &gt;</span>
                            </li>
                        </ul>
                    </div>

                    {/* Footer: 동의하기 버튼 */}
                    <div className="modal-footer border-0 p-4 pt-0 mt-2">
                        <button type="button" className="btn btn-primary w-100 py-2 fw-bold" onClick={moveToAccountJoin} disabled={!isNextEnabled} >
                            동의하기
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    )

}

export default Modal;
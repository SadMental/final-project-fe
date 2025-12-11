import React from "react";

const Stepper = ({ currentStep }) => {
    return (
        <div className="d-flex justify-content-center align-items-center mb-5 position-relative" style={{ minHeight: "80px" }}>
            
            {/* ----------------------------------------------------------- */}
            {/* [연결선] 원들 사이를 이어주는 선 */}
            {/* ----------------------------------------------------------- */}
            <div className="position-absolute d-flex align-items-center" style={{ width: '200px', top: '22px', zIndex: 0 }}>
                {/* 1. 회색 배경선 (항상 100% 깔려있음) */}
                <div 
                    className="w-100 bg-light" 
                    style={{ height: '4px' }}
                ></div>
                
                {/* 2. 초록색 진행선 (step이 2가 되면 너비가 0% -> 100%로 늘어남) */}
                <div 
                    className="position-absolute bg-success" 
                    style={{ 
                        height: '4px', 
                        width: currentStep >= 2 ? '100%' : '0%', 
                        transition: 'width 0.5s ease-in-out' // 스르륵 차오르는 애니메이션
                    }}
                ></div>
            </div>

            {/* ----------------------------------------------------------- */}
            {/* [1단계] 본인 인증 원형 */}
            {/* ----------------------------------------------------------- */}
            <div className="text-center position-relative" style={{ width: '120px', zIndex: 1 }}>
                <div 
                    className={`rounded-circle d-flex align-items-center justify-content-center mx-auto shadow-sm fw-bold fs-5 border
                        ${currentStep >= 1 ? 'bg-success text-white border-success' : 'bg-white text-muted'}`}
                    style={{ width: '45px', height: '45px', transition: 'all 0.3s' }}
                >
                    1
                </div>
                <div className={`mt-2 small fw-bold ${currentStep >= 1 ? 'text-success' : 'text-muted'}`}>
                    본인 인증
                </div>
            </div>

            {/* 가운데 여백 (선이 보이는 공간 확보) */}
            <div style={{ width: '100px' }}></div>

            {/* ----------------------------------------------------------- */}
            {/* [2단계] 정보 입력 원형 */}
            {/* ----------------------------------------------------------- */}
            <div className="text-center position-relative" style={{ width: '120px', zIndex: 1 }}>
                <div 
                    className={`rounded-circle d-flex align-items-center justify-content-center mx-auto shadow-sm fw-bold fs-5 border
                        ${currentStep >= 2 ? 'bg-success text-white border-success' : 'bg-white text-muted'}`}
                    style={{ width: '45px', height: '45px', transition: 'all 0.3s' }}
                >
                    2
                </div>
                <div className={`mt-2 small fw-bold ${currentStep >= 2 ? 'text-success' : 'text-muted'}`}>
                    정보 입력
                </div>
            </div>

        </div>
    );
};

export default Stepper;
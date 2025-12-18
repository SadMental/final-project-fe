import axios from "axios";
import { useCallback, useEffect, useState } from "react"
import { FaArrowRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Jumbotron from "../templates/Jumbotron";
import "../kakaopay/KakaoPay.css";
import "./AccountPay.css";
import { numberWithComma } from "../../utils/format";
import { formatDateTime } from "../../utils/dateFormat";
import { useAtom, useAtomValue } from "jotai";
import { accessTokenState, loginCompleteState } from "../../utils/jotai";

export default function AccountPayInformation() {

    //jotai state
    // const [accessToken, setAccessToken] = useAtom(accessTokenState);
    const [paymentList, setPaymentList] = useState([]);
    const loginComplete = useAtomValue(loginCompleteState);

    useEffect(() => {
        // 토큰이 있을 때만 데이터 로드 (선택 사항)
        if (loginComplete === true) {
            loadData();
        }
    }, [loginComplete]); // 토큰이 로드되면 실행

    const loadData = useCallback(async () => {

        const { data } = await axios.get("/payment/account")
        setPaymentList(data);
    }, [setPaymentList]);

    const calculateStatus = useCallback(payment => {
        const { paymentTotal, paymentRemain } = payment;
        if (paymentTotal === paymentRemain) return "결제 완료";
        if (paymentRemain === 0) return "결제 전체 취소";
        return "결제 부분 취소";
    }, []);

    const checkPaymentRefund = useCallback((paymentTime) => {
        const base = new Date(paymentTime).getTime();
        const after3Days = base + 3 * 24 * 60 * 60 * 1000;

        return Date.now() >= after3Days;
    }, []);

    const statusTextColor = useCallback((payment) => {
        const { paymentTotal, paymentRemain } = payment;
        if (paymentTotal === paymentRemain) return "info";
        if (paymentRemain === 0) return "danger";
        return "dark";
    }, []);

    return (<>


        <div
            className="fade-jumbotron"
            style={{ animationDelay: `${0.03}s` }}
        >
            {/* <Jumbotron subject="내 카카오페이 결제 내역" detail="카카오페이 결제 내역을 알아봅시다."></Jumbotron> */}

            <div className="row">
                <div className="col">
                    <h3 className="text-center">카카오페이 결제내역 조회</h3>
                    <p className="text-center text-desc">
                        카카오페이에서 결제내역을 알아봅시다.
                    </p>
                </div>
            </div>
        </div>

        {/* <div
            className="fade-link"
            style={{ animationDelay: `${0.03}s` }}
        >
            <div className="row my-4">
                <div className="col-6 text-center">
                    <Link to="/kakaopay/buy" className="none-decortion">카카오페이 결제하기</Link>
                </div>
                <div className="col-6 text-center">
                    <Link to="/" className="none-decortion">홈</Link>
                </div>
            </div>
        </div> */}


        <hr className="mt-5" />

        {paymentList.map((payment, i) => (
            <div
                key={i}
                className="fade-item"
                style={{ animationDelay: `${i * 0.03}s` }}
            >
                <div className="p-4 shadow rounded d-flex align-items-center">

                    {/* 왼쪽 제목 (고정 폭) */}
                    <div className="fw-bold" style={{ width: 220 }}>
                        {payment.paymentName}
                    </div>

                    {/* 가운데 4줄 (왼쪽으로 밀착) */}
                    <div className="d-flex flex-column gap-1 text-smallSize ms-3">
                        <div className="row">
                            <div className="col-sm-4 text-primary">거래금액</div>
                            <div className="col-sm-8 text-secondary">총 {numberWithComma(payment.paymentTotal)}원</div>
                        </div>
                        <div className="row">
                            <div className="col-sm-4 text-primary">거래번호</div>
                            <div className="col-sm-8 text-secondary">{payment.paymentTid}</div>
                        </div>
                        <div className="row">
                            <div className="col-sm-4 text-primary">거래일시</div>
                            <div className="col-sm-8 text-secondary">{formatDateTime(payment.paymentTime)}</div>
                        </div>
                        <div className="row">
                            <div className="col-sm-4 text-primary">상태</div>
                            <div className={`col-sm-8 text-${statusTextColor(payment)}`}>{calculateStatus(payment)}</div>
                        </div>
                    </div>

                    {/* 오른쪽 버튼 (끝으로 밀기) */}
                    <div className="ms-auto">
                        <Link
                            to={`/kakaopay/pay/detail/${payment.paymentNo}`}
                            state={{ isRefund: !checkPaymentRefund(payment.paymentTime) }}
                            className="btn btn-outline-info"
                            style={{ fontSize: "0.8em" }}
                        >
                            자세히 보기 <FaArrowRight />
                        </Link>
                    </div>

                </div>

            </div>
        ))}
    </>)
}
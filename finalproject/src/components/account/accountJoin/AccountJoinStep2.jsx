import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaAsterisk, FaEraser, FaEye, FaEyeSlash, FaKey, FaMagnifyingGlass, FaPaperPlane, FaSpinner, FaUser, FaXmark } from "react-icons/fa6";
import axios from "axios";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";

const AccountJoinStep2 = ({ verifiedPhone }) => {
    // 이동도구
    const navigate = useNavigate();

    //state
    const [account, setAccount] = useState({
        accountId: "", accountPw: "", accountPw2: "",
        accountEmail: "", accountBirth: "", accountGender: "",
        accountNickname: "", accountContact: verifiedPhone
    });
    const [accountClass, setAccountClass] = useState({
        accountId: "", accountPw: "", accountPw2: "",
        accountEmail: "", accountBirth: "", accountGender: "",
        accountNickname: "", accountContact: verifiedPhone
    });
    // 입력정보가 문제가 될 경우 나오는 피드백 state
    const [accountIdFeedback, setAccountIdFeedback] = useState("");
    const [accountPwFeedback, setAccountPwFeedback] = useState("");
    const [accountNicknameFeedback, setAccountNicknameFeedback] = useState("");

    //callback
    const changeStrValue = useCallback(e => {
        const { name, value } = e.target;
        setAccount(prev => ({ ...prev, [name]: value }))

        // 입력창을 비웠을 때 상태 초기화
        if (value.length === 0) {
            setAccountClass(prev => ({ ...prev, [name]: "" }));
            if (name === 'accountId') setAccountIdFeedback("");
            if (name === 'accountPw') setAccountPwFeedback("");
            if (name === 'accountNickname') setAccountNicknameFeedback("");
        }
    }, [account]);
    const changeDateValue = useCallback((newValue) => {
        if (newValue) {
            const formattedDate = newValue.format("YYYY-MM-DD");
            setAccount(prev => ({ ...prev, accountBirth: formattedDate }));
        }
        else {
            setAccount(prev => ({ ...prev, accountBirth: "" }));
        }
    }, [account]);

    //아이디 검사
    const checkAccountId = useCallback(async (e) => {
        const regex = /^[a-z][a-z0-9]{4,19}$/;
        const isValid = regex.test(account.accountId);
        if (isValid) {// 형식을 통과하면
            // 중복검사 실행
            const { data } = await axios.get(`/account/accountId/${account.accountId}`)
            if (data === true) {
                setAccountClass(prev => ({ ...prev, accountId: "is-valid" }));
            }
            else {
                setAccountClass(prev => ({ ...prev, accountId: "is-invalid" }));
                setAccountIdFeedback("이미 사용중인 아이디입니다")
            }
        }
        else {//형식오류
            setAccountClass(prev => ({ ...prev, accountId: "is-invalid" }));
            setAccountIdFeedback("아이디는 영문 소문자로 시작하며 숫자를 포함한 5-20자로 작성하세요")
        }
    }, [account.accountId]);

    // 비밀번호 검사
    const [showPassword, setShowPassword] = useState(false);
    const checkAccountPw = useCallback((e)=>{
        // 비밀번호 형식 검사
        const regex = /^(?=.*?[A-Z]+)(?=.*?[a-z]+)(?=.*?[0-9]+)(?=.*?[!@#$]+)[A-Za-z0-9!@#$]{8,16}$/;
        const isValid1 = regex.test(account.accountPw);

        // 비밀번호 일치 검사
        const isValid2 = (account.accountPw === account.accountPw2);

        setAccountClass(prev=>({
            ...prev,
            accountPw: account.accountPw.length > 0 ? (isValid1 ? "is-valid" : "is-invalid") : "",
            accountPw2: account.accountPw2.length > 0 ? (isValid2 && isValid1 ? "is-valid" : "is-invalid") : ""
        }));


    }, [account.accountPw, account.accountPw2]);

    //닉네임 검사
    const checkAccountNickname = useCallback(async () => {
        const regex = /^[가-힣0-9]{2,10}$/;
        const isValid = regex.test(account.accountNickname);
        if (isValid === true) {
            const { data } = await axios.get(`/account/accountNickname/${account.accountNickname}`)
            if (data === true) {
                setAccountClass(prev => ({ ...prev, accountNickname: "is-valid" }));
            }
            else {
                setAccountClass(prev => ({ ...prev, accountNickname: "is-invalid" }));
                setAccountNicknameFeedback("이미 사용중인 닉네임입니다");
            }
        }
        else {
            setAccountClass(prev => ({ ...prev, accountNickname: "is-invalid" }));
            setAccountNicknameFeedback("한글 또는 숫자 2~10글자로 작성하세요");
        }
    }, [account.accountNickname]);

    // 이메일 검사
    const checkAccountEmail = useCallback(e => {
        const emailValue = account.accountEmail;
        if (emailValue.length === 0) {
            setAccountClass(prev => ({ ...prev, accountEmail: "" }));
            return;
        }
        const regex = /^[a-z0-9]+@[a-z0-9.]+$/;
        const isValid = regex.test(account.accountEmail);
        if (isValid) {
            setAccountClass(prev => ({ ...prev, accountEmail: "is-valid" }));
        }
        else {
            setAccountClass(prev => ({ ...prev, accountEmail: "is-invalid" }));
        }
    }, [account.accountEmail]);

    // 모든 필수 항목 유효검사
    const accountValid = useMemo(() => {
        if (accountClass.accountId !== "is-valid") return false;
        if (accountClass.accountPw !== "is-valid") return false;
        if (accountClass.accountPw2 !== "is-valid") return false;
        if (accountClass.accountNickname !== "is-valid") return false;
        //선택 항목 (미입력은 괜찮지만 잘못된 입력은 문제가 됨)
        if (accountClass.accountEmail === "is-invalid") return false;
        if (accountClass.accountBirth === "is-invalid") return false;
        if (accountClass.accountGender === "is-invalid") return false;
        //모두 통과하면 성공
        return true;
    }, [accountClass]);

    // 최종 가입
    const sendData = useCallback(async () => {
        if (accountValid === false) return;
        await axios.post("/account/join", account);
        navigate("/");//완료페이지
    }, [account, accountValid]);
    return (
        <div className="card shadow-sm border-0 mt-4">
            <div className="card-body p-5">
                <h3 className="fw-bold mb-4">2단계. 정보입력</h3>

                {/* 아이디 */}
                <div className="row mt-4">
                    <label className="col-sm-3 col-form-label">
                        아이디 <FaAsterisk className="text-danger" />
                    </label>
                    <div className="col-sm-9">
                        <div className="d-flex gap-2">
                            <input type="text" className={`form-control ${accountClass.accountId}`}
                                name="accountId" value={account.accountId} onChange={changeStrValue} />
                            <button type="button" className="btn btn-dark text-nowrap" onClick={checkAccountId}>
                                아이디확인
                            </button>
                        </div>
                        {accountClass.accountId === "is-valid" && (
                            <div className="valid-feedback d-block">사용 가능한 아이디입니다!</div>
                        )}
                        {accountClass.accountId === "is-invalid" && (
                            <div className="invalid-feedback d-block">{accountIdFeedback}</div>
                        )}
                    </div>
                </div>
                {/* 비밀번호 */}
                <div className="row mt-4">
                    <label className="col-sm-3 col-form-label">
                        비밀번호
                        <FaAsterisk className="text-danger" />
                        {showPassword === true ? (
                            <FaEye className="ms-4" onClick={e => setShowPassword(false)} />
                        ) : (
                            <FaEyeSlash className="ms-4" onClick={e => setShowPassword(true)} />
                        )}
                    </label>
                    <div className="col-sm-9">
                        <input type={showPassword === true ? "text" : "password"} className={`form-control ${accountClass.accountPw}`}
                            name="accountPw" value={account.accountPw} onChange={changeStrValue}
                            onBlur={checkAccountPw} />
                        <div className="valid-feedback">사용 가능한 비밀번호 형식입니다</div>
                        <div className="invalid-feedback">대문자,소문자,숫자,특수문자를 반드시 1개 포함하여 8~16자로 작성하세요</div>
                    </div>
                </div>
                {/* 비밀번호 확인 */}
                <div className="row mt-4">
                    <label className="col-sm-3 col-form-label">
                        비밀번호 확인
                        <FaAsterisk className="text-danger" />
                        {showPassword === true ? (
                            <FaEye className="ms-4" onClick={e => setShowPassword(false)} />
                        ) : (
                            <FaEyeSlash className="ms-4" onClick={e => setShowPassword(true)} />
                        )}
                    </label>
                    <div className="col-sm-9">
                        <input type={showPassword === true ? "text" : "password"} className={`form-control ${accountClass.accountPw2}`}
                            name="accountPw2" value={account.accountPw2} onChange={changeStrValue}
                            onBlur={checkAccountPw} />
                        <div className="valid-feedback">비밀번호가 일치합니다</div>
                        <div className="invalid-feedback">{accountPwFeedback}</div>
                    </div>
                </div>
                {/* 닉네임 */}
                <div className="row mt-4">
                    <label className="col-sm-3 col-form-label">
                        닉네임 <FaAsterisk className="text-danger" />
                    </label>
                    <div className="col-sm-9">
                        <div className="d-flex gap-2">
                            <input type="text" className={`form-control ${accountClass.accountNickname}`}
                                name="accountNickname" value={account.accountNickname} onChange={changeStrValue} />
                            <button type="button" className="btn btn-dark text-nowrap" onClick={checkAccountNickname}>
                                닉네임확인
                            </button>
                        </div>
                        {accountClass.accountNickname === "is-valid" && (
                            <div className="valid-feedback d-block">사용 가능한 닉네임입니다!</div>
                        )}
                        {accountClass.accountNickname === "is-invalid" && (
                            <div className="invalid-feedback d-block">{accountNicknameFeedback}</div>
                        )}
                    </div>
                </div>
                {/* 이메일 */}
                <div className="row mt-4">
                    <label className="col-sm-3 col-form-label">
                        이메일
                    </label>
                    <div className="col-sm-9">
                        <input type="text"
                            className={`form-control ${accountClass.accountEmail}`}
                            name="accountEmail" value={account.accountEmail} onChange={changeStrValue}
                            onBlur={checkAccountEmail} placeholder="[선택] 아이디/비밀번호 찾기에 사용됩니다." />
                        <div className="valid-feedback"></div>
                        <div className="invalid-feedback">부적합한 이메일 형식입니다</div>
                    </div>
                </div>

                {/* 성별 */}
                <div className="row mt-4">
                    <label className="col-sm-3 col-form-label">
                        성별
                    </label>
                    <div className="col-sm-9">
                        <div className="btn-group w-100" role="group">
                            {/* 1. 남자 버튼 */}
                            <button
                                type="button"
                                className={`btn ${account.accountGender === '남' ? 'btn-outline-success fw-bold' : 'btn-outline-secondary'}`}
                                onClick={() => setAccount({ ...account, accountGender: '남' })}
                            >
                                남
                            </button>

                            {/* 2. 여자 버튼 */}
                            <button
                                type="button"
                                className={`btn ${account.accountGender === '여' ? 'btn-outline-success fw-bold' : 'btn-outline-secondary'}`}
                                onClick={() => setAccount({ ...account, accountGender: '여' })}
                            >
                                여
                            </button>

                            {/* 3. 선택안함 버튼 */}
                            <button
                                type="button"
                                className={`btn ${account.accountGender === "" ? 'btn-outline-success fw-bold' : 'btn-outline-secondary'}`}
                                onClick={() => setAccount({ ...account, accountGender: "" })}
                            >
                                선택안함
                            </button>
                        </div>
                    </div>
                </div>

                {/* 날짜 */}
                <div className="row mt-4">
                    <label className="col-sm-3 col-form-label">
                        생년월일
                    </label>
                    <div className="col-sm-9">
                        <LocalizationProvider dateAdapter={AdapterDayjs} >
                            <DatePicker className="w-100" format="YYYY-MM-DD"
                                value={account.accountBirth ? dayjs(account.accountBirth) : null}
                                onChange={changeDateValue}
                                slotProps={{ textField: { size: 'small', className: 'form-control' } }} />
                        </LocalizationProvider>
                    </div>
                </div>

                {/* 가입버튼 */}
                <div className="row mt-5">
                    <div className="col">
                        <button type="button" className="btn btn-success w-100"
                            disabled={!accountValid} onClick={sendData}>
                            <FaUser className="me-2" />
                            <span>{accountValid ? "회원 가입하기" : "필수 항목 작성 후 가입 가능"}</span>
                        </button>
                    </div>
                </div>



            </div>
        </div>
    )
}

export default AccountJoinStep2;
import { useState } from "react";
import { useNavigate } from "react-router-dom"

export default function AccountJoin(){
    // 이동 도구
    const navigate = useNavigate();

    //state
    const [account, setAccount] = useState({
        accountId : "",         accountPw : "",
        accountEmail : "",      accountBirth  
    });

    return (
        <h1>회원가입 페이지</h1>
    )
}
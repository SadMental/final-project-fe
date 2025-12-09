import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// booststarp
import "bootstrap/dist/css/bootstrap.min.css"
import "bootswatch/dist/cosmo/bootstrap.min.css"
// import "bootstrap/dist/js/bootstrap.bundle.min.js"
import "bootstrap";

import './index.css'

// axios
import "./utils/axios"


createRoot(document.getElementById('root')).render(
    <App />
)

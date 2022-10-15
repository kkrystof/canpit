import { NextPage } from "next/types";
import Coloseum from "../../components/Coloseum";


const Homepage: NextPage = (req) => {
    return <div style={{height: '100vh'}}>
        <Coloseum/>
    </div>
}

export default Homepage
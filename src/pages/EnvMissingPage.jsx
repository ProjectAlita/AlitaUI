
import { MISSING_ENVS } from "@/common/constants"
import { Container } from "@mui/material"


export const contentPageStyle = {minHeight: 'calc(100vh - 141px)'}

const EnvMissingPage = () => {
    return (
        <Container style={{
            ...contentPageStyle,
            marginTop: '50px',
            minHeight: 'calc(100vh - 191px)'
        }}>
            <p style={{color: 'red'}}>[Error]</p>
            <p> System env missing: </p>
            <ul>
              {MISSING_ENVS.map(item => <li key={item}>{item}</li>)}
            </ul>
        </Container>
    )
}
export default EnvMissingPage
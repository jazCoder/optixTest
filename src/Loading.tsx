import AtomicSpinner from 'atomic-spinner'
import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";

export const Loading = (): ReactJSXElement => {
    return (
        <div>
            <AtomicSpinner atomSize={300}/>
            <h2 className={'loading'}>Loading ....</h2>
        </div>
    )
}
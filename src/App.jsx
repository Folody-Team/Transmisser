import React, { useEffect, useState } from "react";
import { IoMdAdd } from 'react-icons/io';

const App = () => {
    const [input, setInput] = useState(true)

    return (
        <div style={{
            width: '100%',
        }}>
            {input ? <></> : <div style={{
                position: 'fixed',
                width: '100%',
                top: 0,
                left: 0,
                height: '100vh',
                zIndex: 1,
                background: 'rgb(0, 0, 0, 0.4)'
            }} onClick={() => {
                setInput(true)
            }}></div>}
            <div style={{
                width: '100%',
                zIndex: 10
            }}>
                <div style={{
                    position: 'relative',
                    width: '100%',
                    borderRadius: '12px',
                    display: 'flex',
                    zIndex: 10
                }} className="input" id="input">
                    {input ? <span style={{
                        width: '100%',
                        background: 'transparent',
                        outline: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px 25px',
                        color: '#7e7e7e',
                        fontSize: '16px',
                        cursor: 'pointer',
                        zIndex: 10
                    }} onClick={() => {
                        setInput(false)

                    }} >Enter url</span> : <>
                        <input style={{
                            width: '100%',
                            background: 'transparent',
                            outline: 'none',
                            padding: '10px 25px',
                            color: '#ededed',
                            fontSize: '16px',
                            zIndex: 10
                        }} id="inputin" placeholder="Enter url" />

                    </>}

                    <span className="addBtn" style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '5px',
                        margin: '8px',
                        borderRadius: '10px',
                        zIndex: 10
                    }}>
                        <IoMdAdd color="#7d7da1" size={35} />
                    </span>
                </div>
            </div>
            <div style={{
                width: '100%',
                height: '100%',
                padding: '20px 0'
            }}>
                <div style={{
                    width: '100%',
                    height: 'calc(100vh - 200px)',
                    borderRadius: '14px',
                    border: 'rgb(42, 43, 69, 0.5) dashed 3px'
                }}>

                </div>
            </div>
        </div>

    )
}

export default App

import React from "react";
import { IoMdAdd } from 'react-icons/io';

const App = () => {

    return (
        <div style={{
            width: '100%',
        }}>
            <div style={{
                width: '100%'
            }}>
                <div style={{
                    width: '100%',
                    background: 'rgb(42, 43, 69, 0.3)',
                    borderRadius: '12px',
                    display: 'flex'
                }} className="input">
                    <input style={{
                        width: '100%',
                        background: 'transparent',
                        outline: 'none',
                        padding: '12px 25px',
                        color: '#ededed',
                        fontSize: '16px'
                    }} placeholder="Enter url" />
                    <span className="addBtn" style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '5px',
                        margin: '8px',
                        borderRadius: '10px'
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

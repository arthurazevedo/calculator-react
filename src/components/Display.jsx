import React from 'react';
import './Display.css';

export default props => <div className={`display ${props.className}`}>{props.value}</div>;
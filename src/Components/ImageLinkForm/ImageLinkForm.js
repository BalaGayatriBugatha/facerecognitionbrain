import React from 'react';
import './ImageLinkForm.css'

const ImageLinkForm=({onInputChange,onButtonClick})=>{
	return (
		<div>
		<p className='f3'>{'This magic brain will detect faces from any given image url'}</p>
		<div className='center'>
		<div className='center form pa4 br3 shadow-5'>

		<input className='f4 pa2 w-70 center' type='text' onChange={onInputChange}/>
		<button className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple' onClick={onButtonClick}>Detect</button>
		</div>
		</div>
		</div>

		);
}
export default ImageLinkForm;
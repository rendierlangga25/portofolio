import React from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.jsx'
import './index.css'
class Boundary extends React.Component{
  state={e:null}
  static getDerivedStateFromError(e){return {e}}
  render(){return this.state.e?<div style={{padding:24,fontFamily:'system-ui',maxWidth:560,margin:'10vh auto'}}><h1 style={{fontSize:20}}>Terjadi kesalahan</h1><p style={{color:'#555',marginTop:8}}>Muat ulang halaman. Jika berlanjut, kirim pesan di bawah ini ke pengembang:</p><pre style={{background:'#f3f3f3',padding:12,marginTop:12,whiteSpace:'pre-wrap',fontSize:12}}>{String(this.state.e?.stack||this.state.e).slice(0,600)}</pre></div>:this.props.children}
}
createRoot(document.getElementById('root')).render(<Boundary><App/></Boundary>)

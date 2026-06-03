import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('Cometail render failed', error, info)
  }

  reset = () => {
    try {
      localStorage.removeItem('cometail-v8-firebase-foundation-store')
      localStorage.removeItem('cometail-v8-4-store')
    } catch (_) {
      // ignore storage cleanup errors
    }
    this.setState({ hasError: false, error: null })
    window.location.href = '/login'
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <main className="error-fallback">
        <div className="error-card">
          <span className="brand-mark">☄️</span>
          <p className="eyebrow">Cometail recovery</p>
          <h1>잠시 앱을 다시 열어야 해요</h1>
          <p>
            로그인 정보나 화면 상태가 꼬여서 Cometail이 멈췄어요. 아래 버튼을 누르면 저장된 임시 화면 상태를 정리하고 로그인 화면으로 돌아갑니다.
          </p>
          <button className="primary-button" onClick={this.reset}>로그인 화면으로 다시 시작하기</button>
          {this.state.error?.message && <small>{this.state.error.message}</small>}
        </div>
      </main>
    )
  }
}

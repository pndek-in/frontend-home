import { useEffect } from "react"

type GoogleLoginProps = {
  isButton?: boolean
  isPrompt?: boolean
  googleClientId: string
}

export default function GoogleLogin({
  isButton = false,
  isPrompt = false,
  googleClientId
}: GoogleLoginProps) {
  useEffect(() => {
    const scriptId = "google-login-script"
    if (document.getElementById(scriptId)) {
      // Script already loaded
      return
    }

    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.id = scriptId
    document.body.appendChild(script)

    return () => {
      // Clean up the script when component unmounts
      document.body.removeChild(script)
    }
  }, [])
  return (
    <>
      <div
        id="g_id_onload"
        data-client_id={googleClientId}
        data-login_uri="http://localhost:8081/auth/google"
        data-auto_prompt={isPrompt ? "true" : "false"}
      />
      {isButton && (
        <div
          className="g_id_signin h-[40px]"
          data-type="standard"
          data-size="large"
          data-theme="outline"
          data-text="sign_in_with"
          data-shape="rectangular"
          data-logo_alignment="left"
        />
      )}
    </>
  )
}

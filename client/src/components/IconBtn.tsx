import { FC } from "react"

export default function IconBtn({ disable, onClick, Icon, isActive, color, children }: { disable?: boolean, onClick?: any, Icon: FC, isActive?: boolean, color?: string, children?: any }) {
  return (
    <button
      disabled={disable}
      onClick={onClick}
      className={`btn icon-btn ${isActive ? "icon-btn-active" : ""} ${color || ""}`}>
      <span className={`${children != null ? "mr-2" : ""}`}>
        <Icon />
      </span>
      {children}
    </button>
  )
}
import { useNotify } from "use-notify-rxjs";

import style from "./notify.module.css"

export function Notify() {
  const { notifications, clear } = useNotify();

  if (notifications.length === 0) {
    return <></>;
  }

  return <ul id={style.notifications}>
    {notifications.map(notify => (
      <li className={style[notify.type]}>
        {notify.message} <span onClick={() => clear(notify.id)}>&times;</span>
      </li>
    ))}
  </ul>
}
import { useOthers, useSelf } from "@/liveblocks.config";
import { memo, useMemo } from "react";
import { Avatar } from "./Avatar";
import styles from "./Avatar.module.css";

const ActiveUsers = () => {
  const users = useOthers();
  const currentUser = useSelf();
  const hasMoreUsers = useMemo(() => users.length > 3, [users]);

  const memoizedUsers = useMemo(() => {
    return (
      <div className="flex items-center justify-center gap-1">
        <div className="flex pl-3">
          {currentUser && <Avatar name="You" />}

          {users.slice(0, 3).map(({ connectionId, info }) => {
            return (
              <Avatar key={connectionId} name={"haseeb"} otherStyle="-ml-3" />
            );
          })}

          {hasMoreUsers && (
            <div className={styles.more}>+{users.length - 3}</div>
          )}
        </div>
      </div>
    );
  }, [users?.length]);

  return memoizedUsers;
};

export default memo(ActiveUsers);

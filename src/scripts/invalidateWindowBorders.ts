import { LogicalSize, appWindow } from "@tauri-apps/api/window";

const invalidateWindowBorders = async () => {
  const oldSize = await appWindow.outerSize();
  const newSize = new LogicalSize(oldSize.width, oldSize.height + 1);
  await appWindow.setSize(newSize);
  await appWindow.setSize(oldSize);
};

export default invalidateWindowBorders;

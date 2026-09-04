import React from 'react'
export const useSheetController = () => {
  const controller = React.useContext(SheetControllerContext)
  const isHidden = controller?.hidden
  const isShowingNonSheet = isHidden && controller?.open
  return {
    controller,
    isHidden,
    isShowingNonSheet,
    disableDrag: controller?.disableDrag,
  }
}
export const SheetControllerContext = React.createContext(null)
//# sourceMappingURL=useSheetController.js.map

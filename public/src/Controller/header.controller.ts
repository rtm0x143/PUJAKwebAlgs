import HeaderView from "../View/header.view";

class HeaderController {
    private _headerView: HeaderView;

    constructor(headerView: HeaderView) {
        this._headerView = headerView;

        this._headerView.openMenuHandler((overlay: HTMLDivElement) => {
            this.openMenu(overlay);
        })

        this._headerView.closeMenuHandler((overlay: HTMLDivElement) => {
            this.closeMenu(overlay);
        })
    }

    openMenu(overlay: HTMLDivElement) {
        if (overlay.className === 'navigation-closed') {
            overlay.className = 'navigation-opened';
        }
    }

    closeMenu(overlay: HTMLDivElement) {
        if (overlay.className === 'navigation-opened') {
            overlay.className = 'navigation-closed';
        }
    }
}

export default HeaderController;
export interface CMConfiguratorElement extends HTMLElement {
    loadConfigurator(templateUuid: string): void
    getParameterList(): ParameterInfo[]
    setParameter(parameterId: string, parameterType: string, parameterValue: string): void
    saveSnapshot(): void
    captureSnapshotInMemory(): Promise<string>
    zoomIn(factor: number): void
    zoomOut(factor: number): void
    resetCamera(): void
    /** Returns null until loadingCompleted. */
    getCameraState(): CameraState | null
    /**
     * Reaches only states that the user can reach by hand: orbit and zoom within the limits, and a pivot change
     * only when panning is on. Values outside the limits are clamped. Throws when orbit is null, when orbitEnabled
     * is false, or when target differs from the current pivot and panEnabled is false.
     */
    setCameraState(update: CameraStateUpdate): void
    getPricesAsList(): Promise<PricedItem[]>
    viewInAr(): void
    generateQrCode(url: string, errorCorrectionLevel: "high" | "low", width: number, margin: number): Promise<string>

    addEventListener(type: "loadingCompleted", listener: (this: this, ev: Event) => void): void
    addEventListener(type: "configurationLoaded", listener: (this: this, ev: Event) => void): void
    addEventListener(type: "changeCompleted", listener: (this: this, ev: CustomEvent<{id: string; value: string; type: string}>) => void): void
    addEventListener(type: "arUrl", listener: (this: this, ev: CustomEvent<string>) => void): void
    /**
     * Fires at most once per frame while the camera moves, and once right after loadingCompleted.
     * Add this listener in the customElements.whenDefined("cm-configurator-main").then(...) callback.
     * A listener added before the element is defined gets no cameraChanged events.
     */
    addEventListener(type: "cameraChanged", listener: (this: this, ev: CustomEvent<CameraState>) => void): void

    //Also available as html attribute template-uuid, usable as <cm-configurator-main template-uuid="123"></cm-configurator-main> to load a scene on startup.
    templateUuid: number

    //Also available as html attribute use-external-menu, usable as <cm-configurator-main use-external-menu="true"></cm-configurator-main>. Must be set if the external menu is used.
    useExternalMenu: string

    //Also available as html attribute ui-style-override, usable as <cm-configurator-main ui-style-override="accordion"></cm-configurator-main>.
    uiStyleOverride: string

    //Also available as html attribute fullscreen-target, usable as <cm-configurator-main fullscreen-target=".my-wrapper"></cm-configurator-main>.
    //CSS selector (resolved against the host document) for the element the fullscreen button puts into fullscreen instead of the configurator
    //itself. Use with use-external-menu to fullscreen a wrapper containing both the viewer and the menu — the styled external menu then stays
    //visible and the internal menu is not shown in fullscreen.
    fullscreenTarget: string
}

export type ParamType = "config" | "material" | "material-article-id" | "template" | "image" | "string" | "boolean" | "number" | "object"

export type ParameterInfo = {
    id: string
    type: ParamType
    name: string
    values?: {
        id: string
        name: string
    }[]
    value?: any
}

export type PricedItem = {
    description: string
    sku?: string
    price: number
}

/** The camera relative to its pivot. Lengths are in scene units, angles in degrees. The up axis is +Y. */
export type CameraOrbit = {
    /** The pivot. A pan by the user moves it. */
    target: [number, number, number]
    /** Angle around the up axis. 0 = the camera is on the +Z side of the pivot; positive values turn toward +X. */
    azimuth: number
    /** Angle from the up axis. 0 = from above, 90 = from the horizon. */
    polar: number
    /** Distance from the camera to the pivot. */
    distance: number
}

/** The orbit limits of the template camera, after defaults. */
export type CameraOrbitLimits = {
    minDistance: number
    maxDistance: number
    minPolar: number
    maxPolar: number
    /** Absent when the azimuth is not limited. */
    minAzimuth?: number
    /** Absent when the azimuth is not limited. */
    maxAzimuth?: number
}

export type CameraState = {
    position: [number, number, number]
    /** Unit vector of the direction the camera faces. */
    direction: [number, number, number]
    /** Null when the camera has no pivot (an untargeted template camera). */
    orbit: CameraOrbit | null
    /** Null when the camera has no pivot. */
    limits: CameraOrbitLimits | null
    /** The user can orbit. zoomIn, zoomOut, resetCamera and setCameraState work only when this is true. */
    orbitEnabled: boolean
    /** The user can move the pivot. */
    panEnabled: boolean
    /** orbitEnabled, and the current distance is above minDistance. */
    canZoomIn: boolean
    /** orbitEnabled, and the current distance is below maxDistance. */
    canZoomOut: boolean
}

/** The settable part of the camera state. Absent fields keep their current value. */
export type CameraStateUpdate = {
    orbit: Partial<CameraOrbit>
}
export interface CMConfiguratorElement extends HTMLElement {
    loadScene(sceneId: number): void
    getParameterList(): ParameterInfo[]
    setParameter(parameterId: string, parameterType: string, parameterValue: string): void
    saveSnapshot(): void
    zoomIn(factor: number): void
    zoomOut(factor: number): void
    resetCamera(): void

    addEventListener(type: "loadingCompleted", listener: (this: this, ev: Event) => any): void
    addEventListener(type: "changeCompleted", listener: (this: this, ev: CustomEvent<{id: string; value: string; type: string}>) => any): void

    //Also available as html attribute scene-id, usable as <cm-configurator-main scene-id="123"></cm-configurator-main> to load a scene on startup.
    sceneId: number

    //Also available as html attribute use-external-menu, usable as <cm-configurator-main use-external-menu="true"></cm-configurator-main>. Must be set if the external menu is used.
    useExternalMenu: string
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

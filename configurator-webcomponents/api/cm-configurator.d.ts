export interface CMConfiguratorElement extends HTMLElement {
    loadConfigurator(templateUuid: string): void
    getParameterList(): ParameterInfo[]
    setParameter(parameterId: string, parameterType: string, parameterValue: string): void
    saveSnapshot(): void
    captureSnapshotInMemory(): Promise<string>
    zoomIn(factor: number): void
    zoomOut(factor: number): void
    resetCamera(): void
    getPricesAsList(): Promise<PricedItem[]>
    viewInAr(): void
    generateQrCode(url: string, errorCorrectionLevel: "high" | "low", width: number, margin: number): Promise<string>

    addEventListener(type: "loadingCompleted", listener: (this: this, ev: Event) => void): void
    addEventListener(type: "configurationLoaded", listener: (this: this, ev: Event) => void): void
    addEventListener(type: "changeCompleted", listener: (this: this, ev: CustomEvent<{id: string; value: string; type: string}>) => void): void
    addEventListener(type: "arUrl", listener: (this: this, ev: CustomEvent<string>) => void): void

    //Also available as html attribute template-uuid, usable as <cm-configurator-main template-uuid="123"></cm-configurator-main> to load a scene on startup.
    templateUuid: number

    //Also available as html attribute use-external-menu, usable as <cm-configurator-main use-external-menu="true"></cm-configurator-main>. Must be set if the external menu is used.
    useExternalMenu: string

    //Also available as html attribute ui-style-override, usable as <cm-configurator-main ui-style-override="accordion"></cm-configurator-main>.
    uiStyleOverride: string
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
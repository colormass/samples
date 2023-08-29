export class CmConfigurator {
    element
    configuratorOrigin
    configuratorContentWindow

    constructor(iframeElementId) {
        this.element = document.getElementById(iframeElementId)
        this.configuratorContentWindow = this.element.contentWindow
        this.configuratorOrigin = new URL(this.element.src).origin
        window.addEventListener("message", (a) => this.receiveMessage(a), false)
    }

    // API

    getParameterList() {
        const promise = new Promise((resolve) => {
            const listener = (event) => {
                this.element.removeEventListener("parameterList", listener)
                resolve(event.detail)
            }
            this.element.addEventListener("parameterList", listener)
        })
        this.sendMessage("parameterList")
        return promise
    }

    setParameter(id, type, value) {
        const promise = new Promise((resolve) => {
            const listener = () => {
                this.element.removeEventListener("changeCompleted", listener)
                resolve()
            }
            this.element.addEventListener("changeCompleted", listener)
        })
        this.sendMessage("parameter", {id: id, type: type, value: value})
        return promise
    }

    setSceneId(id) {
        this.sendMessage("sceneId", {value: id})
    }

    saveSnapshot() {
        this.sendMessage("saveSnapshot")
    }

    viewInAr() {
        this.sendMessage("viewInAr")
    }

    showUi(value) {
        this.sendMessage("showUi", {value: value})
    }

    zoomIn(value) {
        this.sendMessage("zoomIn", {value: value})
    }

    zoomOut(value) {
        this.sendMessage("zoomOut", {value: value})
    }

    resetCamera() {
        this.sendMessage("resetCamera")
    }

    /**
     * Event types:
     * - ready
     * - loadingCompleted
     * - keydown: Events cannot be passed around through messages, so this is a stripped down version of the original keydown event.
     * - changeCompleted
     * - sceneEvent
     * - parameterList
     *
     * @param eventName {string}
     * @param parameters
     */
    onEvent(eventName, parameters) {
        // console.log(`Event triggered: ${eventName}. Parameters:`, parameters)
        this.element.dispatchEvent(new CustomEvent(eventName, {detail: parameters}))
    }

    // Communication helpers

    sendMessage(methodName, parameters) {
        this.configuratorContentWindow.postMessage(
            {
                data: {
                    method: methodName,
                    parameters: parameters,
                },
                type: "colormass",
            },
            this.configuratorOrigin
        )
    }

    receiveMessage(message) {
        if (message.origin !== this.configuratorOrigin || message.data.type !== "colormass") return
        const data = message.data.data
        this.onEvent(data.method, data.parameters)
    }
}

import {ContentCaptureClient} from '../../js/capture/renderer/ContentCaptureClient';
import {SpectronMain} from '../../js/test/SpectronMain';
import {MainTestResultWriter} from '../../js/test/results/writer/MainTestResultWriter';

async function start() {

    let mainWindow = await SpectronMain.setup();

    // FIXME: can't use devtools as it creates a seocnd window.
    //mainWindow.webContents.toggleDevTools();

    let contentCaptureClient = new ContentCaptureClient(mainWindow);

    let waitForControllerPromise = contentCaptureClient.waitForController();

    mainWindow.loadFile(__dirname + '/app.html');

    console.log("Waiting for controller startup promise...");
    await waitForControllerPromise;
    console.log("Waiting for controller startup promise...done");

    console.log("Waiting for new capture result now:");

    let captured = await contentCaptureClient.requestNewCapture();

    console.log("GOT IT!", captured);

    let mainTestResultsWriter = new MainTestResultWriter(mainWindow);

    mainTestResultsWriter.write(captured);

    // now we need to tell spectron we have it... that's part of the challenge
    // her.

}

start().catch(err => console.log(err));
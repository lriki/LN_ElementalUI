import { FlexWindowsManager } from "ts/core/FlexWindowsManager";
import { TestEnv } from "./TestEnv";


beforeAll(() => {
});

afterAll(() => {
});

test("Basic1", () => {
    FlexWindowsManager.instance = new FlexWindowsManager();
    FlexWindowsManager.instance.initialize();
});


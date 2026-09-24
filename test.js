const { XenditComponentsTest } = require("xendit-components-web");
const components = new XenditComponentsTest({});
try {
  let res = components.submit();
  console.log("Return value:", res);
  if (res && res.then) {
    console.log("It is a promise");
  } else {
    console.log("Not a promise");
  }
} catch (e) {
  console.error("Error:", e);
}

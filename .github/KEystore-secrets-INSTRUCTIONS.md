CI setup instructions for Android signed builds

This repository ships a GitHub Actions workflow at `.github/workflows/android-release.yml` that:

- builds an unsigned AAB with JDK 21
- decodes a base64-encoded keystore from a repository secret
- switches to JDK 17 and signs the AAB using `jarsigner`
- uploads the signed AAB as a workflow artifact

Required repository secrets (in Settings → Secrets → Actions):

- ANDROID_KEYSTORE_BASE64: base64-encoded content of your `keystore.jks` file
  - Create with (on your machine):

    ```powershell
    # PowerShell (Windows) - base64 encode
    [Convert]::ToBase64String([IO.File]::ReadAllBytes('C:\path\to\keystore.jks')) | Out-File -Encoding ascii keystore.b64
    # copy the contents of keystore.b64 into the GitHub secret
    ```

- ANDROID_KEYSTORE_PASSWORD: the keystore store password
- ANDROID_KEY_PASSWORD: the private key password
- ANDROID_KEY_ALIAS: the alias of the key (e.g. `agroisync`)

Notes and recommendations
- Do NOT store the raw `keystore.jks` in the repository. Use the secret above instead.
- After adding secrets, trigger the workflow via the Actions tab → the "Build and sign Android AAB" workflow → Run workflow.
- The workflow will publish the signed AAB as an artifact you can download from the workflow run page.
- For a production process, enable App Signing by Google Play and rotate/store backups of your keystore in a secure vault (1Password, AWS Secrets Manager, HashiCorp Vault).

If you want, I can also create a small PowerShell helper script to produce the base64 on Windows and print the copyable string for the secret.

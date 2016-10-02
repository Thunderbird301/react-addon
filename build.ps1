if(test-path("newTBAB.xpi")) {
    remove-Item newTBAB.xpi
}
if(test-path("newTBAB.zip")) {
    remove-Item newTBAB.zip
}

#npm install

function Add-Zip
{
    param([string]$zipfilename)

    if(-not (test-path($zipfilename)))
    {
        set-content $zipfilename ("PK" + [char]5 + [char]6 + ("$([char]0)" * 18))
        (dir $zipfilename).IsReadOnly = $false
    }
    $zipfilename = resolve-path $zipfilename
    $shellApplication = new-object -com shell.application
    $zipPackage = $shellApplication.NameSpace($zipfilename)

    foreach($file in $input)
    {
            $zipPackage.CopyHere($file.FullName)
            Start-sleep -milliseconds 1000
    }
}

if(!(Test-Path -Path "modules/react/" )){
    New-Item -ItemType directory -Path "modules/react/"
}

Write-Host "Converting JSX"
foreach ($file in Get-ChildItem "react") {
    $new = $file -replace 'x$', ''
    node_modules\.bin\babel "react/$file" -o "modules/react/$new" --presets react
    Write-Host -NoNewLine "."
}

Write-Host
Write-Host "Building xpi"
foreach($file in "content", "defaults", "modules", "install.rdf", "chrome.manifest") {
    Get-Item $file | add-Zip newTBAB.zip
    Write-Host -NoNewLine "."
}


Rename-Item newTBAB.zip newTBAB.xpi

Write-Host
Write-Host "Done"
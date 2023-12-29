# PowerShell script to play a noise on the motherboard speaker

# Function to play a beep on the PC speaker
function Play-PCSpeakerBeep {
    [cmdletbinding()]
    param (
        [int]$Frequency = 1000,   # Frequency of the beep in hertz
        [int]$Duration = 500      # Duration of the beep in milliseconds
    )

    $consoleFrequency = [math]::floor(1193180 / $Frequency)
    
    # Set the PIT speaker timer
    Out-Port 0x43 0xb6
    Out-Port 0x42 $consoleFrequency
    Start-Sleep -Milliseconds 50

    # Turn on the speaker
    $prevVolume = [console]::volume
    [console]::volume = 100

    # Play the sound
    [console]::beep($Frequency, $Duration)

    # Restore the previous volume
    [console]::volume = $prevVolume
}

# Function to write a value to a port
function Out-Port {
    param (
        [Parameter(Position = 0, Mandatory = $true)]
        [int]$Port,

        [Parameter(Position = 1, Mandatory = $true)]
        [byte]$Value
    )
    
    $x = New-Object System.IO.Ports.SerialPort
    $x.PortName = [System.IO.Ports.SerialPort]::GetPortNames()[0]
    $x.Open()
    $x.Write([byte[]]@($Value))
    $x.Close()
}

# Play a beep on the PC speaker
Play-PCSpeakerBeep -Frequency 1000 -Duration 500

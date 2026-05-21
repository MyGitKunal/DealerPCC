# PowerShell Utility Functions for Dealer PCC Project
# Provides Unix-like command equivalents for Windows PowerShell

# PowerShell equivalent of 'head' command
function head {
    param(
        [Parameter(ValueFromPipeline=$true)]
        [object[]]$InputObject,
        
        [int]$n = 10,
        [int]$c = -1
    )
    
    begin {
        $items = @()
    }
    
    process {
        $items += $InputObject
    }
    
    end {
        if ($c -gt 0) {
            # Return first N characters
            $text = $items -join "`n"
            return $text.Substring(0, [Math]::Min($c, $text.Length))
        } else {
            # Return first N lines (default 10)
            return $items | Select-Object -First $n
        }
    }
}

# PowerShell equivalent of 'tail' command
function tail {
    param(
        [Parameter(ValueFromPipeline=$true)]
        [object[]]$InputObject,
        
        [int]$n = 10,
        [int]$c = -1
    )
    
    begin {
        $items = @()
    }
    
    process {
        $items += $InputObject
    }
    
    end {
        if ($c -gt 0) {
            # Return last N characters
            $text = $items -join "`n"
            $start = [Math]::Max(0, $text.Length - $c)
            return $text.Substring($start)
        } else {
            # Return last N lines (default 10)
            return $items | Select-Object -Last $n
        }
    }
}

# PowerShell equivalent of 'grep' command
function grep {
    param(
        [Parameter(Mandatory=$true, Position=0)]
        [string]$Pattern,
        
        [Parameter(ValueFromPipeline=$true)]
        [object[]]$InputObject,
        
        [switch]$v  # Invert match
    )
    
    process {
        if ($v) {
            $InputObject | Where-Object { $_ -notmatch $Pattern }
        } else {
            $InputObject | Where-Object { $_ -match $Pattern }
        }
    }
}

# PowerShell equivalent of 'wc -l' command
function word-count {
    param(
        [Parameter(ValueFromPipeline=$true)]
        [object[]]$InputObject
    )
    
    begin {
        $count = 0
    }
    
    process {
        $count++
    }
    
    end {
        return $count
    }
}

Set-Alias -Name wc -Value word-count -Scope Global -Force

Export-ModuleMember -Function head, tail, grep, word-count

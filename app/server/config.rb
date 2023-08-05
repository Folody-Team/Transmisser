require 'fileutils'

module ServerConfig
  Path = {
    'productPath' => File.join(__dir__, 'packs'),
    'devPath' => File.join('app', 'build', 'packs')
  }
end
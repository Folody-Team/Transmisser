=begin
This is transmisser react webserver
Using sinatra webserver
=end
exit if Object.const_defined?(:Ocra)

require_relative 'server'

run App
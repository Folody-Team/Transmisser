require 'sinatra'
require 'fileutils'


exit if Object.const_defined?(:Ocra)



class App < Sinatra::Base
  @env = 'dev'
  set :port, ENV['PORT'] || 3000

  if @env == 'dev'
    set :static, File.join('..', 'build', 'packs')
  else
    set :static, File.join(__dir__, 'packs')
  end

  get '/' do
    file = File.join(settings.static, 'index.html')
    File.read(file)
  end

  get '/*.js' do
    send_file File.join(settings.static, "#{params[:splat].first}.js")
  end

  run!
end
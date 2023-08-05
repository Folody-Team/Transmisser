require 'sinatra'
require 'fileutils'
require_relative 'config'

class App < Sinatra::Application
  @env = 'dev'
  set :port, ENV['PORT'] || 3000

  if @env == 'dev'
    set :static, ServerConfig::Path['devPath']
  else
    set :static, ServerConfig::Path['productPath']
  end  
  run!
end

class Routes < App
  get '/' do
    file = File.join(settings.static, 'index.html')
    File.read(file)
  end

  get '/*.js' do
    send_file File.join(settings.static, "#{params[:splat].first}.js")
  end
  
  get '/*.png' do
    send_file File.join(settings.static, "#{params[:splat].first}.png")
  end
end
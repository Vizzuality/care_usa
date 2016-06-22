# CARE USA

We have worked closely with a team from [CARE USA](http://www.care.org) to build a beautiful visualization to explore donations and projects data on a beautiful map. Explore CARE's impact around the world and drill down to learn where CARE's donors are located. Check how CARE is contributing in aiding different countries in refugees crisis.

![image](https://raw.githubusercontent.com/Vizzuality/care_usa/master/public/care-map.jpg)

This application was built with [ReactJS](https://facebook.github.io/react/) and [BackboneJS](http://backbonejs.org/), and fetches it's data from [CAPI](https://github.com/Vizzuality/capi), an API built with [Ruby on Rails](http://weblog.rubyonrails.org/) that interfaces with [CartoDB](http://www.cartodb.com) where the data is being managed.

## Installation

Requirements:

* NodeJs 5.2+ [How to install](https://nodejs.org/download/)

Install dependencies:

	npm install

## Usage

To run the server:

	npm start

To build:

	npm run build

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request :D

## Notes

If you are planning to work on this project, remember:
*"timelineDate has to always prevail over any other date."*

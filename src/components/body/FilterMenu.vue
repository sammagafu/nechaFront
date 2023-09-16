<template>
    <div class="pt-1">
        <div class="block border-b border-gray-300 pb-7 mb-7">
            <div class="flex items-center justify-between mb-2.5">
            <h2 class="font-semibold text-heading text-xl md:text-2xl">Filters</h2><button
                class="flex-shrink text-xs mt-0.5 transition duration-150 ease-in focus:outline-none hover:text-heading"
                aria-label="Clear All">Clear All</button>
        </div>
        <div class="flex flex-wrap -m-1.5 pt-2"></div>
    </div>

    <div class="block border-b border-gray-300 pb-7 mb-7">
        <h3 class="text-heading text-sm md:text-base font-semibold mb-7">Category</h3>
        <div class="mt-2 flex flex-col space-y-4"><label
                class="group flex items-center text-heading text-sm cursor-pointer"><input type="checkbox"
                    class="form-checkbox w-5 h-5 border border-gray-300 rounded cursor-pointer transition duration-500 ease-in-out focus:ring-offset-0 hover:border-heading focus:outline-none focus:ring-0 focus-visible:outline-none checked:bg-heading checked:hover:bg-heading checked:focus:bg-heading"
                    name="woman" value="woman"><span class="ms-4 -mt-0.5">Woman</span></label><label
                class="group flex items-center text-heading text-sm cursor-pointer"><input type="checkbox"
                    class="form-checkbox w-5 h-5 border border-gray-300 rounded cursor-pointer transition duration-500 ease-in-out focus:ring-offset-0 hover:border-heading focus:outline-none focus:ring-0 focus-visible:outline-none checked:bg-heading checked:hover:bg-heading checked:focus:bg-heading"
                    name="man" value="man"><span class="ms-4 -mt-0.5">Man</span></label><label
                class="group flex items-center text-heading text-sm cursor-pointer"><input type="checkbox"
                    class="form-checkbox w-5 h-5 border border-gray-300 rounded cursor-pointer transition duration-500 ease-in-out focus:ring-offset-0 hover:border-heading focus:outline-none focus:ring-0 focus-visible:outline-none checked:bg-heading checked:hover:bg-heading checked:focus:bg-heading"
                    name="watch" value="watch"><span class="ms-4 -mt-0.5">Watch</span></label><label
                class="group flex items-center text-heading text-sm cursor-pointer"><input type="checkbox"
                    class="form-checkbox w-5 h-5 border border-gray-300 rounded cursor-pointer transition duration-500 ease-in-out focus:ring-offset-0 hover:border-heading focus:outline-none focus:ring-0 focus-visible:outline-none checked:bg-heading checked:hover:bg-heading checked:focus:bg-heading"
                    name="kids" value="kids"><span class="ms-4 -mt-0.5">Kids</span></label><label
                class="group flex items-center text-heading text-sm cursor-pointer"><input type="checkbox"
                    class="form-checkbox w-5 h-5 border border-gray-300 rounded cursor-pointer transition duration-500 ease-in-out focus:ring-offset-0 hover:border-heading focus:outline-none focus:ring-0 focus-visible:outline-none checked:bg-heading checked:hover:bg-heading checked:focus:bg-heading"
                    name="sports" value="sports"><span class="ms-4 -mt-0.5">Sports</span></label><label
                class="group flex items-center text-heading text-sm cursor-pointer"><input type="checkbox"
                    class="form-checkbox w-5 h-5 border border-gray-300 rounded cursor-pointer transition duration-500 ease-in-out focus:ring-offset-0 hover:border-heading focus:outline-none focus:ring-0 focus-visible:outline-none checked:bg-heading checked:hover:bg-heading checked:focus:bg-heading"
                    name="sunglass" value="sunglass"><span class="ms-4 -mt-0.5">Sunglass</span></label><label
                class="group flex items-center text-heading text-sm cursor-pointer"><input type="checkbox"
                    class="form-checkbox w-5 h-5 border border-gray-300 rounded cursor-pointer transition duration-500 ease-in-out focus:ring-offset-0 hover:border-heading focus:outline-none focus:ring-0 focus-visible:outline-none checked:bg-heading checked:hover:bg-heading checked:focus:bg-heading"
                    name="bags" value="bags"><span class="ms-4 -mt-0.5">Bags</span></label><label
                class="group flex items-center text-heading text-sm cursor-pointer"><input type="checkbox"
                    class="form-checkbox w-5 h-5 border border-gray-300 rounded cursor-pointer transition duration-500 ease-in-out focus:ring-offset-0 hover:border-heading focus:outline-none focus:ring-0 focus-visible:outline-none checked:bg-heading checked:hover:bg-heading checked:focus:bg-heading"
                    name="sneakers" value="sneakers"><span class="ms-4 -mt-0.5">Sneakers</span></label></div>
    </div>

    <div class="block border-b border-gray-300 pb-7 mb-7">
        <h3 class="text-heading text-sm md:text-base font-semibold mb-7">Brands</h3>
        <div class="mt-2 flex flex-col space-y-4"><label
                class="group flex items-center text-heading text-sm cursor-pointer"><input type="checkbox"
                    class="form-checkbox w-5 h-5 border border-gray-300 rounded cursor-pointer transition duration-500 ease-in-out focus:ring-offset-0 hover:border-heading focus:outline-none focus:ring-0 focus-visible:outline-none checked:bg-heading checked:hover:bg-heading checked:focus:bg-heading"
                    name="shovia" value="shovia"><span class="ms-4 -mt-0.5">Shovia</span></label><label
                class="group flex items-center text-heading text-sm cursor-pointer"><input type="checkbox"
                    class="form-checkbox w-5 h-5 border border-gray-300 rounded cursor-pointer transition duration-500 ease-in-out focus:ring-offset-0 hover:border-heading focus:outline-none focus:ring-0 focus-visible:outline-none checked:bg-heading checked:hover:bg-heading checked:focus:bg-heading"
                    name="fusion" value="fusion"><span class="ms-4 -mt-0.5">Fusion</span></label><label
                class="group flex items-center text-heading text-sm cursor-pointer"><input type="checkbox"
                    class="form-checkbox w-5 h-5 border border-gray-300 rounded cursor-pointer transition duration-500 ease-in-out focus:ring-offset-0 hover:border-heading focus:outline-none focus:ring-0 focus-visible:outline-none checked:bg-heading checked:hover:bg-heading checked:focus:bg-heading"
                    name="hunter shoes" value="hunter-shoes"><span class="ms-4 -mt-0.5">Hunter
                    Shoes</span></label><label
                class="group flex items-center text-heading text-sm cursor-pointer"><input type="checkbox"
                    class="form-checkbox w-5 h-5 border border-gray-300 rounded cursor-pointer transition duration-500 ease-in-out focus:ring-offset-0 hover:border-heading focus:outline-none focus:ring-0 focus-visible:outline-none checked:bg-heading checked:hover:bg-heading checked:focus:bg-heading"
                    name="club shoes" value="club-shoes"><span class="ms-4 -mt-0.5">Club Shoes</span></label><label
                class="group flex items-center text-heading text-sm cursor-pointer"><input type="checkbox"
                    class="form-checkbox w-5 h-5 border border-gray-300 rounded cursor-pointer transition duration-500 ease-in-out focus:ring-offset-0 hover:border-heading focus:outline-none focus:ring-0 focus-visible:outline-none checked:bg-heading checked:hover:bg-heading checked:focus:bg-heading"
                    name="hoppister" value="hoppister"><span class="ms-4 -mt-0.5">Hoppister</span></label><label
                class="group flex items-center text-heading text-sm cursor-pointer"><input type="checkbox"
                    class="form-checkbox w-5 h-5 border border-gray-300 rounded cursor-pointer transition duration-500 ease-in-out focus:ring-offset-0 hover:border-heading focus:outline-none focus:ring-0 focus-visible:outline-none checked:bg-heading checked:hover:bg-heading checked:focus:bg-heading"
                    name="blaze fashion" value="blaze-fashion"><span class="ms-4 -mt-0.5">Blaze
                    Fashion</span></label><label
                class="group flex items-center text-heading text-sm cursor-pointer"><input type="checkbox"
                    class="form-checkbox w-5 h-5 border border-gray-300 rounded cursor-pointer transition duration-500 ease-in-out focus:ring-offset-0 hover:border-heading focus:outline-none focus:ring-0 focus-visible:outline-none checked:bg-heading checked:hover:bg-heading checked:focus:bg-heading"
                    name="elegance" value="elegance"><span class="ms-4 -mt-0.5">Elegance</span></label><label
                class="group flex items-center text-heading text-sm cursor-pointer"><input type="checkbox"
                    class="form-checkbox w-5 h-5 border border-gray-300 rounded cursor-pointer transition duration-500 ease-in-out focus:ring-offset-0 hover:border-heading focus:outline-none focus:ring-0 focus-visible:outline-none checked:bg-heading checked:hover:bg-heading checked:focus:bg-heading"
                    name="fashadil" value="fashadil"><span class="ms-4 -mt-0.5">Fashadil</span></label></div>
    </div>
    <div class="block border-b border-gray-300 pb-7 mb-7">
        <h3 class="text-heading text-sm md:text-base font-semibold mb-7">Price</h3>
        <div class="mt-2 flex flex-col space-y-4"><label
                class="group flex items-center text-heading text-sm cursor-pointer"><input type="checkbox"
                    class="form-checkbox w-5 h-5 border border-gray-300 rounded cursor-pointer transition duration-500 ease-in-out focus:ring-offset-0 hover:border-heading focus:outline-none focus:ring-0 focus-visible:outline-none checked:bg-heading checked:hover:bg-heading checked:focus:bg-heading"
                    name="under $50" value="0-50"><span class="ms-4 -mt-0.5">Under $50</span></label><label
                class="group flex items-center text-heading text-sm cursor-pointer"><input type="checkbox"
                    class="form-checkbox w-5 h-5 border border-gray-300 rounded cursor-pointer transition duration-500 ease-in-out focus:ring-offset-0 hover:border-heading focus:outline-none focus:ring-0 focus-visible:outline-none checked:bg-heading checked:hover:bg-heading checked:focus:bg-heading"
                    name="$50 to $100" value="50-100"><span class="ms-4 -mt-0.5">$50 to $100</span></label><label
                class="group flex items-center text-heading text-sm cursor-pointer"><input type="checkbox"
                    class="form-checkbox w-5 h-5 border border-gray-300 rounded cursor-pointer transition duration-500 ease-in-out focus:ring-offset-0 hover:border-heading focus:outline-none focus:ring-0 focus-visible:outline-none checked:bg-heading checked:hover:bg-heading checked:focus:bg-heading"
                    name="$100 to $150" value="100-150"><span class="ms-4 -mt-0.5">$100 to $150</span></label><label
                class="group flex items-center text-heading text-sm cursor-pointer"><input type="checkbox"
                    class="form-checkbox w-5 h-5 border border-gray-300 rounded cursor-pointer transition duration-500 ease-in-out focus:ring-offset-0 hover:border-heading focus:outline-none focus:ring-0 focus-visible:outline-none checked:bg-heading checked:hover:bg-heading checked:focus:bg-heading"
                    name="$150 to $200" value="150-200"><span class="ms-4 -mt-0.5">$150 to $200</span></label><label
                class="group flex items-center text-heading text-sm cursor-pointer"><input type="checkbox"
                    class="form-checkbox w-5 h-5 border border-gray-300 rounded cursor-pointer transition duration-500 ease-in-out focus:ring-offset-0 hover:border-heading focus:outline-none focus:ring-0 focus-visible:outline-none checked:bg-heading checked:hover:bg-heading checked:focus:bg-heading"
                    name="$200 to $300" value="200-300"><span class="ms-4 -mt-0.5">$200 to $300</span></label><label
                class="group flex items-center text-heading text-sm cursor-pointer"><input type="checkbox"
                    class="form-checkbox w-5 h-5 border border-gray-300 rounded cursor-pointer transition duration-500 ease-in-out focus:ring-offset-0 hover:border-heading focus:outline-none focus:ring-0 focus-visible:outline-none checked:bg-heading checked:hover:bg-heading checked:focus:bg-heading"
                    name="$300 to $500" value="300-500"><span class="ms-4 -mt-0.5">$300 to $500</span></label><label
                class="group flex items-center text-heading text-sm cursor-pointer"><input type="checkbox"
                    class="form-checkbox w-5 h-5 border border-gray-300 rounded cursor-pointer transition duration-500 ease-in-out focus:ring-offset-0 hover:border-heading focus:outline-none focus:ring-0 focus-visible:outline-none checked:bg-heading checked:hover:bg-heading checked:focus:bg-heading"
                    name="$500 to $1000" value="500-1000"><span class="ms-4 -mt-0.5">$500 to $1000</span></label><label
                class="group flex items-center text-heading text-sm cursor-pointer"><input type="checkbox"
                    class="form-checkbox w-5 h-5 border border-gray-300 rounded cursor-pointer transition duration-500 ease-in-out focus:ring-offset-0 hover:border-heading focus:outline-none focus:ring-0 focus-visible:outline-none checked:bg-heading checked:hover:bg-heading checked:focus:bg-heading"
                    name="over $1000" value="1000-"><span class="ms-4 -mt-0.5">Over $1000</span></label></div>
    </div>

</div></template>